"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
// import { listPolicyDetails } from "../../../projects/data/policy";
import {
  AndroidManagementDevice,
  ListDevicesResponse,
} from "@/app/types/device";
import { prepareDeviceData } from "@/app/api/emm/pubsub/lib/data/save-device";

type ResolvedDeviceData = {
  enterprise_id: string;
  device_identifier: string | null;
  policy_identifier: string | null;
  device_data: AndroidManagementDevice;
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

  // デバイスリストを作成
  const devicesList = devices
    .map((device) => {
      const policyName = device.policyName;
      const deviceName = device.name;
      if (!deviceName || !policyName) return;
      const policyIdentifier = policyName.includes(
        `enterprises/${enterpriseId}/policies/`
      )
        ? (policyName.split(`enterprises/${enterpriseId}/policies/`)[1] ?? null)
        : null;

      const deviceIdentifier = deviceName.includes(
        `enterprises/${enterpriseId}/devices/`
      )
        ? (deviceName.split(`enterprises/${enterpriseId}/devices/`)[1] ?? null)
        : null;
      return {
        enterprise_id: enterpriseId,
        device_identifier: deviceIdentifier,
        policy_identifier: policyIdentifier,
        device_data: device,
        updated_at: new Date().toISOString(),
      };
    })
    .filter((device) => device !== undefined);

  // upsertする共通データを作成
  const createBaseDeviceData = (device: ResolvedDeviceData) => ({
    device_identifier: device.device_identifier,
    enterprise_id: device.enterprise_id,
    updated_at: device.updated_at,
  });

  // devicesテーブルに記録するデータ
  const upsertDevices = devicesList.map((device) => {
    const baseData = createBaseDeviceData(device);
    return {
      ...baseData,
      policy_identifier: device.policy_identifier,
      device_data: prepareDeviceData(device.device_data) as Json,
    };
  });
  // device_displaysテーブルに記録するデータ
  const upsertDeviceDisplays = devicesList.map((device) => {
    return {
      enterprise_id: device.enterprise_id,
      device_identifier: device.device_identifier,
      last_status_report_time: device.device_data.lastStatusReportTime ?? "",
      displays: device.device_data.displays as Json[],
    };
  });
  // device_hardware_statusテーブルに記録するデータ
  const upsertDeviceHardwareStatusList = devicesList
    .map((device) => {
      return (
        device.device_data.hardwareStatusSamples
          ?.map((hardwareStatus) => {
            if (!hardwareStatus.createTime) return;
            return {
              enterprise_id: device.enterprise_id,
              device_identifier: device.device_identifier,
              create_time: hardwareStatus.createTime,
              hardware_status: hardwareStatus as Json,
            };
          })
          .filter((hardwareStatus) => hardwareStatus !== undefined) ?? []
      );
    })
    .flat();

  // device_metricsテーブルに記録するデータ
  const upsertDeviceMetricsList = devicesList
    .map((device) => {
      return (
        device.device_data.hardwareStatusSamples
          ?.map((hardwareStatus) => {
            if (!hardwareStatus.createTime) return;
            return {
              enterprise_id: enterpriseId,
              device_identifier: device.device_identifier,
              create_time: hardwareStatus.createTime,
              battery_temperatures: hardwareStatus.batteryTemperatures ?? null,
              cpu_temperatures: hardwareStatus.cpuTemperatures ?? null,
              gpu_temperatures: hardwareStatus.gpuTemperatures ?? null,
              skin_temperatures: hardwareStatus.skinTemperatures ?? null,
              cpu_usages: hardwareStatus.cpuUsages ?? null,
              fan_speeds: hardwareStatus.fanSpeeds ?? null,
            };
          })
          .filter((hardwareStatus) => hardwareStatus !== undefined) ?? []
      );
    })
    .flat();

  // メモリデータの作成
  // const upsertMemoryEvents = devicesList.map((device) => ({
  //   ...createBaseDeviceData(device),
  //   memory_event_data: (device.device_data.memoryEvents as Json) ?? [],
  // }));
  const upsertMemoryEvents = devicesList
    .map((device) => {
      return (
        device.device_data.memoryEvents
          ?.map((memoryEvent) => {
            if (!memoryEvent.createTime || !memoryEvent.eventType) return;
            return {
              enterprise_id: enterpriseId,
              device_identifier: device.device_identifier,
              create_time: memoryEvent.createTime,
              event_type: memoryEvent.eventType,
              byte_count: memoryEvent.byteCount ?? null,
            };
          })
          .filter((memoryEvent) => memoryEvent !== undefined) ?? []
      );
    })
    .flat();
  // デバイスの電源管理データの作成
  const upsertPowerManagementEvents = devicesList.map((device) => ({
    ...createBaseDeviceData(device),
    power_management_event_data:
      (device.device_data.powerManagementEvents as Json) ?? [],
  }));
  // アプリケーションデータの作成
  const upsertApplicationReports = devicesList.map((device) => ({
    ...createBaseDeviceData(device),
    application_report_data:
      (device.device_data.applicationReports as Json) ?? [],
  }));
  // device_historiesテーブルに記録するデータ
  const upsertDeviceHistoryData = devicesList.map((device) => ({
    enterprise_id: device.enterprise_id,
    device_identifier: device.device_identifier,
    device_response_data: (device.device_data as Json) ?? [],
  }));

  const { error } = await supabase.rpc("insert_or_upsert_devices_data", {
    devices: upsertDevices,
    application_reports: upsertApplicationReports,
    memory_events: upsertMemoryEvents,
    power_management_events: upsertPowerManagementEvents,
    device_histories: upsertDeviceHistoryData,
    device_displays: upsertDeviceDisplays,
    device_hardware_status: upsertDeviceHardwareStatusList,
    device_metrics: upsertDeviceMetricsList,
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
