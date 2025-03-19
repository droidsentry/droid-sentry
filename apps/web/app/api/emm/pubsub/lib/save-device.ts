import "server-only";

import { AndroidManagementDevice } from "@/lib/types/device";

import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";
import { getDefaultPolicyId } from "@/lib/emm/policy";

/**
 * デバイスデータから不要なイベントデータを除外
 */
export const prepareDeviceData = (device: AndroidManagementDevice) => {
  const mainDeviceData = { ...device };
  delete mainDeviceData.hardwareStatusSamples;
  delete mainDeviceData.applicationReports;
  delete mainDeviceData.memoryEvents;
  delete mainDeviceData.powerManagementEvents;
  return mainDeviceData;
};

/** この関数は試作中
 * PubSubからの通知で1端末のデータを保存する関数
 * デバイス一覧でも使用するため、必ず認証確認を実施したのち使用すること。
 */
export const saveDeviceStatus = async ({
  enterpriseId,
  deviceId,
  device,
}: {
  enterpriseId: string;
  deviceId: string;
  device: AndroidManagementDevice;
}) => {
  const supabase = createAdminClient();
  const appliedPolicyName = device.appliedPolicyName;
  let policyId = appliedPolicyName?.includes(
    `enterprises/${enterpriseId}/policies/`
  )
    ? appliedPolicyName.split(`enterprises/${enterpriseId}/policies/`)[1] ||
      null
    : null;

  const policyName = device.policyName;
  let requestedPolicyId = policyName?.includes(
    `enterprises/${enterpriseId}/policies/`
  )
    ? policyName.split(`enterprises/${enterpriseId}/policies/`)[1] || null
    : null;
  // デフォルトポリシーの場合は、policyName、appliedPolicyNameからテーブルのPKが取得できないため、デフォルトポリシーのIDを取得する
  if (policyId === "default" || requestedPolicyId === "default") {
    const defaultPolicyId = await getDefaultPolicyId(enterpriseId);
    if (policyId === "default") policyId = defaultPolicyId;
    if (requestedPolicyId === "default") requestedPolicyId = defaultPolicyId;
  }

  try {
    // devicesテーブルに記録するデータ
    const deviceData = {
      enterprise_id: enterpriseId,
      device_id: deviceId,
      policy_id: policyId,
      requested_policy_id: requestedPolicyId,
      device_details: prepareDeviceData(device) as Json,
      updated_at: new Date().toISOString(),
    };
    // device_hardware_statusテーブルに記録するデータ
    const hardwareMetricsList =
      device.hardwareStatusSamples
        ?.map((hardwareStatus) => {
          if (!hardwareStatus.createTime) return;
          return {
            device_id: deviceId,
            measured_at: hardwareStatus.createTime,
            metrics: hardwareStatus as Json,
          };
        })
        .filter((hardwareStatus) => hardwareStatus !== undefined) ?? [];

    // memory_eventsテーブルに記録するデータ
    const memoryEventList =
      device.memoryEvents
        ?.map((memoryEvent) => {
          if (!memoryEvent.createTime || !memoryEvent.eventType) return;
          return {
            device_id: deviceId,
            measured_at: memoryEvent.createTime,
            event_type: memoryEvent.eventType,
            byte_count: memoryEvent.byteCount ?? null,
          };
        })
        .filter((memoryEvent) => memoryEvent !== undefined) ?? [];

    // power_management_eventsテーブルに記録するデータ
    const powerEventList =
      device.powerManagementEvents
        ?.map((powerEvent) => {
          if (!powerEvent.createTime || !powerEvent.eventType) return;
          return {
            device_id: deviceId,
            measured_at: powerEvent.createTime,
            event_type: powerEvent.eventType,
            battery_level: powerEvent.batteryLevel ?? null,
          };
        })
        .filter((powerEvent) => powerEvent !== undefined) ?? [];

    // application_reportsテーブルに記録するデータ
    const applicationReportData = {
      device_id: deviceId,
      report_data: (device.applicationReports as Json) ?? [],
      updated_at: new Date().toISOString(),
    };
    // device_historiesテーブルに記録するデータ
    const deviceHistoryData = {
      device_id: deviceId,
      response_details: device as Json,
    };

    // トランザクション処理の実行
    const { error } = await supabase.rpc("insert_or_upsert_devices_data", {
      devices: [deviceData],
      device_hardware_metrics: [hardwareMetricsList],
      device_memory_events: [memoryEventList],
      device_power_events: [powerEventList],
      device_application_reports: [applicationReportData],
      device_history: [deviceHistoryData],
    });
    console.log("Error upsert_device_data", error);
    if (error) throw error;
  } catch (error) {
    console.error(`Failed to save device ${deviceId}:`, error);
    throw new Error(`Failed to save device ${deviceId}: ${error}`);
  }
};
