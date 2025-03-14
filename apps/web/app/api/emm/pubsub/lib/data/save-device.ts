import "server-only";

import { AndroidManagementDevice } from "@/app/types/device";

import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";

/**
 * デバイスデータから不要なイベントデータを除外
 */
export const prepareDeviceData = (device: AndroidManagementDevice) => {
  const mainDeviceData = { ...device };
  // delete mainDeviceData.displays;
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
  deviceIdentifier,
  device,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  device: AndroidManagementDevice;
}) => {
  const supabase = createAdminClient();
  // const policyDetails = await getAdminListPolicyDetails(enterpriseId);
  const appliedPolicyName = device.appliedPolicyName;
  const policyIdentifier = appliedPolicyName?.includes(
    `enterprises/${enterpriseId}/policies/`
  )
    ? appliedPolicyName.split(`enterprises/${enterpriseId}/policies/`)[1] ||
      null
    : null;
  // console.log("policyIdentifier", policyIdentifier);

  const policyName = device.policyName;
  const requestedPolicyIdentifier = policyName?.includes(
    `enterprises/${enterpriseId}/policies/`
  )
    ? policyName.split(`enterprises/${enterpriseId}/policies/`)[1] || null
    : null;
  // console.log("requestedPolicyIdentifier", requestedPolicyIdentifier);
  try {
    // devicesテーブルに記録するデータ
    const deviceData = {
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      policy_identifier: policyIdentifier,
      requested_policy_identifier: requestedPolicyIdentifier,
      device_data: prepareDeviceData(device) as Json,
      updated_at: new Date().toISOString(),
    };
    // device_displaysテーブルに記録するデータ
    const deviceDisplays = {
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      last_status_report_time: device.lastStatusReportTime || null,
      displays: (device.displays as Json[]) ?? [],
    };

    // device_hardware_statusテーブルに記録するデータ
    const deviceHardwareStatusList =
      device.hardwareStatusSamples
        ?.map((hardwareStatus) => {
          if (!hardwareStatus.createTime) return;
          return {
            enterprise_id: enterpriseId,
            device_identifier: deviceIdentifier,
            create_time: hardwareStatus.createTime,
            hardware_status: hardwareStatus as Json,
          };
        })
        .filter((hardwareStatus) => hardwareStatus !== undefined) ?? [];

    // device_metricsテーブルに記録するデータ
    const deviceMetricsList =
      device.hardwareStatusSamples
        ?.map((hardwareStatus) => {
          if (!hardwareStatus.createTime) return;
          return {
            enterprise_id: enterpriseId,
            device_identifier: deviceIdentifier,
            create_time: hardwareStatus.createTime,
            battery_temperatures: hardwareStatus.batteryTemperatures ?? null,
            cpu_temperatures: hardwareStatus.cpuTemperatures ?? null,
            gpu_temperatures: hardwareStatus.gpuTemperatures ?? null,
            skin_temperatures: hardwareStatus.skinTemperatures ?? null,
            cpu_usages: hardwareStatus.cpuUsages ?? null,
            fan_speeds: hardwareStatus.fanSpeeds ?? null,
          };
        })
        .filter((hardwareStatus) => hardwareStatus !== undefined) ?? [];

    // memory_eventsテーブルに記録するデータ
    const memoryEventList =
      device.memoryEvents
        ?.map((memoryEvent) => {
          if (!memoryEvent.createTime || !memoryEvent.eventType) return;
          return {
            enterprise_id: enterpriseId,
            device_identifier: deviceIdentifier,
            create_time: memoryEvent.createTime,
            event_type: memoryEvent.eventType,
            byte_count: memoryEvent.byteCount ?? null,
          };
        })
        .filter((memoryEvent) => memoryEvent !== undefined) ?? [];

    // power_management_eventsテーブルに記録するデータ
    const powerManagementEventList =
      device.powerManagementEvents
        ?.map((powerManagementEvent) => {
          if (
            !powerManagementEvent.createTime ||
            !powerManagementEvent.eventType
          )
            return;
          return {
            enterprise_id: enterpriseId,
            device_identifier: deviceIdentifier,
            create_time: powerManagementEvent.createTime,
            event_type: powerManagementEvent.eventType,
            battery_level: powerManagementEvent.batteryLevel ?? null,
          };
        })
        .filter((powerManagementEvent) => powerManagementEvent !== undefined) ??
      [];

    // application_reportsテーブルに記録するデータ
    const applicationReportData = {
      device_identifier: deviceIdentifier,
      enterprise_id: enterpriseId,
      application_report_data: (device.applicationReports as Json) ?? [],
      updated_at: new Date().toISOString(),
    };
    // device_historiesテーブルに記録するデータ
    const deviceHistoryData = {
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      device_response_data: device as Json,
    };

    // トランザクション処理の実行
    const { error } = await supabase.rpc("insert_or_upsert_devices_data", {
      devices: [deviceData],
      application_reports: [applicationReportData],
      memory_events: memoryEventList,
      power_management_events: powerManagementEventList,
      device_histories: [deviceHistoryData],
      device_displays: [deviceDisplays],
      device_hardware_status: deviceHardwareStatusList,
      device_metrics: deviceMetricsList,
    });
    console.log("Error upsert_device_data", error);
    if (error) throw error;
  } catch (error) {
    console.error(`Failed to save device ${deviceIdentifier}:`, error);
    throw new Error(`Failed to save device ${deviceIdentifier}: ${error}`);
  }
};
