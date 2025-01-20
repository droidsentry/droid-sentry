"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
// import { listPolicyDetails } from "../../../projects/data/policy";
import {
  AndroidManagementDevice,
  ListDevicesResponse,
} from "@/app/types/device";

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
        ? policyName.split(`enterprises/${enterpriseId}/policies/`)[1] ?? null
        : null;

      const deviceIdentifier = deviceName.includes(
        `enterprises/${enterpriseId}/devices/`
      )
        ? deviceName.split(`enterprises/${enterpriseId}/devices/`)[1] ?? null
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

  type ResolvedDeviceData = {
    enterprise_id: string;
    device_identifier: string | null;
    policy_identifier: string | null;
    device_data: AndroidManagementDevice;
    updated_at: string;
  };
  // upsertする共通データを作成
  const createBaseDeviceData = (device: ResolvedDeviceData) => ({
    device_identifier: device.device_identifier,
    enterprise_id: device.enterprise_id,
    updated_at: device.updated_at,
  });
  // デバイス履歴データの作成
  const devicesHistoriesList = devicesList.map((device) => ({
    enterprise_id: device.enterprise_id,
    device_identifier: device.device_identifier,
    device_response_data: device.device_data as Json,
  }));
  // デバイスデータの作成
  const upsertDevices = devicesList.map((device) => {
    const baseData = createBaseDeviceData(device);
    const deviceData = device.device_data as AndroidManagementDevice;
    // 特定のイベントデータを除外
    const mainDeviceData = { ...deviceData };
    delete mainDeviceData.applicationReports;
    delete mainDeviceData.memoryEvents;
    delete mainDeviceData.powerManagementEvents;
    return {
      ...baseData,
      policy_identifier: device.policy_identifier,
      device_data: mainDeviceData as Json,
    };
  });

  // アプリケーションデータの作成
  const upsertApplicationReports = devicesList.map((device) => ({
    ...createBaseDeviceData(device),
    application_report_data: {
      applicationReports: (device.device_data as AndroidManagementDevice)
        .applicationReports,
    } as Json,
  }));
  // メモリデータの作成
  const upsertMemoryEvents = devicesList.map((device) => ({
    ...createBaseDeviceData(device),
    memory_event_data: {
      memoryEvents: (device.device_data as AndroidManagementDevice)
        .memoryEvents,
    } as Json,
  }));
  // デバイスの電源管理データの作成
  const upsertPowerManagementEvents = devicesList.map((device) => ({
    ...createBaseDeviceData(device),
    power_management_event_data: {
      powerManagementEvents: (device.device_data as AndroidManagementDevice)
        .powerManagementEvents,
    } as Json,
  }));

  const { error } = await supabase.rpc("upsert_device_data", {
    devices: upsertDevices,
    application_reports: upsertApplicationReports,
    memory_events: upsertMemoryEvents,
    power_management_events: upsertPowerManagementEvents,
    device_histories: devicesHistoriesList,
  });

  if (error) {
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
