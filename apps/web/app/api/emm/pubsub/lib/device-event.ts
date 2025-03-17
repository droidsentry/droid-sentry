import "server-only";

import { AndroidManagementDevice, DeviceOperation } from "@/app/types/device";
import { Json } from "@/types/database";
import { saveDeviceCommand } from "./save-command";
import { saveDeviceStatus } from "./save-device";

import { BatchUsageLogEvents, NotificationType } from "@/app/types/pubsub";
import { saveUsageLogs } from "./save-usage-logs";
import { saveDeviceInfoSubscriptions } from "./save-device-info-subscriptions";
import { syncDeviceInfo } from "@/app/(main)/[enterpriseId]/devices/lib/device";
// import { saveDeviceInfoSubscriptions } from "./save-device-info-subscriptions";

export const dispatchDeviceEvent = async ({
  enterpriseId,
  deviceId,
  notificationType,
  data,
  operationName,
  messageId,
}: {
  enterpriseId: string;
  deviceId: string;
  notificationType: NotificationType;
  data: Json;
  operationName?: string;
  messageId: string;
}) => {
  switch (notificationType) {
    case "STATUS_REPORT":
      await saveDeviceStatus({
        enterpriseId,
        deviceId,
        device: data as AndroidManagementDevice,
      });
      break;

    case "ENROLLMENT":
      await saveDeviceStatus({
        enterpriseId,
        deviceId,
        device: data as AndroidManagementDevice,
      }).then(() => {
        saveDeviceInfoSubscriptions(enterpriseId);
      });
      break;

    case "COMMAND":
      if (!operationName) break;
      await saveDeviceCommand({
        enterpriseId,
        deviceId,
        operationName,
        devicesOperationData: data as DeviceOperation,
      });
      await syncDeviceInfo(enterpriseId, deviceId); //紛失モード時のデータ取得に使用
      break;

    case "USAGE_LOGS":
      await saveUsageLogs({
        enterpriseId,
        deviceId,
        messageId,
        devicesOperationData: data as BatchUsageLogEvents,
      });
      break;
  }

  return data;
};
