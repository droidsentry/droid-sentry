import "server-only";

import { AndroidManagementDevice } from "@/app/types/device";

import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";

/**
 * デバイスデータから不要なイベントデータを除外
 */
const prepareDeviceData = (device: AndroidManagementDevice) => {
  const mainDeviceData = { ...device };
  delete mainDeviceData.applicationReports;
  delete mainDeviceData.memoryEvents;
  delete mainDeviceData.powerManagementEvents;
  return mainDeviceData;
};

/** この関数は試作中
 * PubSubからの通知で1端末のデータを保存する関数
 */
export const saveDeviceStatus = async ({
  enterpriseId,
  deviceIdentifier,
  device,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  device: AndroidManagementDevice;
}) => {
  const supabase = createAdminClient();
  // const policyDetails = await getAdminListPolicyDetails(enterpriseId);
  const policyName = device.policyName;
  const policyIdentifier = policyName?.includes(
    `enterprises/${enterpriseId}/policies/`
  )
    ? policyName.split(`enterprises/${enterpriseId}/policies/`)[1] || null
    : null;

  try {
    // デバイスデータの準備
    const deviceData = {
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      policy_identifier: policyIdentifier,
      device_data: prepareDeviceData(device) as Json,
      updated_at: new Date().toISOString(),
    };

    // 関連データの準備
    const applicationReportData = {
      device_identifier: deviceIdentifier,
      enterprise_id: enterpriseId,
      application_report_data: {
        applicationReports: device.applicationReports,
      } as Json,
      updated_at: new Date().toISOString(),
    };

    const memoryEventData = {
      device_identifier: deviceIdentifier,
      enterprise_id: enterpriseId,
      memory_event_data: { memoryEvents: device.memoryEvents } as Json,
      updated_at: new Date().toISOString(),
    };

    const powerManagementData = {
      device_identifier: deviceIdentifier,
      enterprise_id: enterpriseId,
      power_management_event_data: {
        powerManagementEvents: device.powerManagementEvents,
      } as Json,
      updated_at: new Date().toISOString(),
    };

    const deviceHistoryData = {
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      device_response_data: device as Json,
    };

    // トランザクション処理の実行
    const { error } = await supabase.rpc("upsert_device_data", {
      devices: [deviceData],
      application_reports: [applicationReportData],
      memory_events: [memoryEventData],
      power_management_events: [powerManagementData],
      device_histories: [deviceHistoryData],
    });
    if (error) throw error;
  } catch (error) {
    console.error(`Failed to save device ${deviceIdentifier}:`, error);
    throw new Error(`Failed to save device ${deviceIdentifier}: ${error}`);
  }
};
