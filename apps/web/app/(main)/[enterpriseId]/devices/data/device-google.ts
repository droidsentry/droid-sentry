"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
// import { listPpolicyDetails.} from "../../../projects/data/policy";
import {
  AndroidManagementDevice,
  ListDevicesResponse,
} from "@/lib/types/device";
import { prepareDeviceData } from "@/app/api/emm/pubsub/lib/save-device";
import { getDefaultPolicyId } from "@/lib/emm/policy";

type ResolvedDeviceData = {
  enterprise_id: string;
  device_id: string | null;
  policy_id: string | null;
  requested_policy_id: string | null;
  device_details: AndroidManagementDevice;
  updated_at: string;
};

/**
 * デバイスをDBに保存する関数
 * @param devices デバイスの配列
 * @param enterpriseId エンタープライズID
 */
const saveDevices = async (
  devices: AndroidManagementDevice[],
  enterpriseId: string
) => {
  const supabase = await createClient();

  // デフォルトポリシーIDをループ前に一度だけ取得
  let defaultPolicyId: string | null = null;
  // デフォルトのポリシーIDをデバイスが必要とする場合のみ取得
  const needsDefaultPolicy = devices.some(
    (device) =>
      device.appliedPolicyName?.includes(
        `enterprises/${enterpriseId}/policies/default`
      ) ||
      device.policyName?.includes(
        `enterprises/${enterpriseId}/policies/default`
      )
  );
  if (needsDefaultPolicy) {
    defaultPolicyId = await getDefaultPolicyId(enterpriseId);
  }

  // デバイスリストを作成
  const devicesList = devices
    .map((device) => {
      const policyName = device.policyName;
      const deviceName = device.name;
      if (!deviceName) return;
      const appliedPolicyName = device.appliedPolicyName;
      let policyId = appliedPolicyName?.includes(
        `enterprises/${enterpriseId}/policies/`
      )
        ? appliedPolicyName.split(`enterprises/${enterpriseId}/policies/`)[1] ||
          null
        : null;

      let requestedPolicyId = policyName?.includes(
        `enterprises/${enterpriseId}/policies/`
      )
        ? policyName.split(`enterprises/${enterpriseId}/policies/`)[1] || null
        : null;

      if (policyId === "default" || requestedPolicyId === "default") {
        if (policyId === "default") policyId = defaultPolicyId;
        if (requestedPolicyId === "default")
          requestedPolicyId = defaultPolicyId;
      }

      const deviceId = deviceName.includes(
        `enterprises/${enterpriseId}/devices/`
      )
        ? (deviceName.split(`enterprises/${enterpriseId}/devices/`)[1] ?? null)
        : null;
      return {
        enterprise_id: enterpriseId,
        device_id: deviceId,
        policy_id: policyId,
        requested_policy_id: requestedPolicyId,
        device_details: prepareDeviceData(device),
        updated_at: new Date().toISOString(),
      };
    })
    .filter((device) => device !== undefined);

  // devicesテーブルに記録するデータ
  const upsertDevices = devicesList.map((device) => {
    return {
      enterprise_id: device.enterprise_id,
      device_id: device.device_id,
      policy_id: device.policy_id,
      requested_policy_id: device.requested_policy_id,
      device_details: device.device_details as Json,
      updated_at: device.updated_at,
    };
  });
  // device_hardware_statusテーブルに記録するデータ
  const upsertDeviceHardwareStatusList = devicesList
    .map((device) => {
      return (
        device.device_details.hardwareStatusSamples
          ?.map((hardwareStatus) => {
            if (!hardwareStatus.createTime) return;
            return {
              device_id: device.device_id,
              measured_at: hardwareStatus.createTime,
              metrics: hardwareStatus as Json,
            };
          })
          .filter((hardwareStatus) => hardwareStatus !== undefined) ?? []
      );
    })
    .flat();
  // memory_eventsテーブルに記録するデータ
  const upsertMemoryEvents = devicesList
    .map((device) => {
      return (
        device.device_details.memoryEvents
          ?.map((memoryEvent) => {
            if (!memoryEvent.createTime || !memoryEvent.eventType) return;
            return {
              device_id: device.device_id,
              measured_at: memoryEvent.createTime,
              event_type: memoryEvent.eventType,
              byte_count: memoryEvent.byteCount ?? null,
            };
          })
          .filter((memoryEvent) => memoryEvent !== undefined) ?? []
      );
    })
    .flat();
  // power_management_eventsテーブルに記録するデータ
  const powerEventList = devicesList
    .map((device) => {
      return (
        device.device_details.powerManagementEvents
          ?.map((powerEvent) => {
            if (!powerEvent.createTime || !powerEvent.eventType) return;
            return {
              device_id: device.device_id,
              measured_at: powerEvent.createTime,
              event_type: powerEvent.eventType,
              battery_level: powerEvent.batteryLevel ?? null,
            };
          })
          .filter((powerEvent) => powerEvent !== undefined) ?? []
      );
    })
    .flat();

  // アプリケーションデータの作成
  const upsertApplicationReports = devicesList.map((device) => ({
    device_id: device.device_id,
    report_data: (device.device_details.applicationReports as Json) ?? [],
    updated_at: device.updated_at,
  }));
  // device_historiesテーブルに記録するデータ
  const upsertDeviceHistoryData = devicesList.map((device) => ({
    device_id: device.device_id,
    response_details: (device.device_details as Json) ?? [],
  }));

  const { error } = await supabase.rpc("insert_or_upsert_devices_data", {
    devices: upsertDevices,
    device_hardware_metrics: upsertDeviceHardwareStatusList,
    device_memory_events: upsertMemoryEvents,
    device_power_events: powerEventList,
    device_application_reports: upsertApplicationReports,
    device_history: upsertDeviceHistoryData,
  });

  if (error) {
    console.log("Error upsert_device_data", error);
    throw new Error(`Failed to save device data: ${error.message}`);
  }
};

/**
 * Googleサーバーとデバイス情報を同期する関数
 * @param enterpriseId
 * @returns デバイスの配列
 * 参考URL:https://developers.google.com/android/management/reference/rest/v1/enterprises.devices/list
 * ライブラリ:https://googleapis.dev/nodejs/googleapis/latest/androidmanagement/classes/Resource$Enterprises$Devices.html#list
 */
export const syncDevicesWithGoogle = async (enterpriseId: string) => {
  // 認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  let nextPageToken: ListDevicesResponse["nextPageToken"] = undefined;
  const enterpriseName = `enterprises/${enterpriseId}`;
  const androidmanagement = await createAndroidManagementClient();
  do {
    const { data } = await androidmanagement.enterprises.devices
      .list({
        parent: enterpriseName,
        pageSize: 20, // 1回のAPI呼び出しで取得する端末数
        pageToken: nextPageToken,
      })
      .catch((error) => {
        console.error("Error Get device list:", error.message);
        throw new Error(error.message);
      });
    const { devices, nextPageToken: token } = data as ListDevicesResponse;
    if (!devices?.length) break; //空の[]も除外

    // 新しく取得したデバイスのみを保存
    await saveDevices(devices, enterpriseId);
    nextPageToken = token;
  } while (nextPageToken);
  revalidatePath(`/${enterpriseId}/devices`);
};
