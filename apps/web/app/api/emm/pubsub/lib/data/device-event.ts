import "server-only";

import { AndroidManagementDevice, DeviceOperation } from "@/app/types/device";
import { Json } from "@/types/database";
import { saveDeviceCommand } from "./save-command";
import { saveDeviceStatus } from "./save-device";
import { notificationType } from "../../route";
import { BatchUsageLogEvents } from "@/app/api/types/event";
import { saveUsageLogs } from "./save-usage-logs";
import { saveDeviceInfoSubscriptions } from "./save-device-info-subscriptions";
import { syncDeviceInfo } from "@/app/(main)/[enterpriseId]/devices/lib/device";
// import { saveDeviceInfoSubscriptions } from "./save-device-info-subscriptions";

export const dispatchDeviceEvent = async ({
  enterpriseId,
  deviceIdentifier,
  notificationType,
  data,
  operationName,
  pubsubMessageId,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  notificationType: notificationType;
  data: Json;
  operationName?: string;
  pubsubMessageId: string;
}) => {
  switch (notificationType) {
    case "STATUS_REPORT":
      await saveDeviceStatus({
        enterpriseId,
        deviceIdentifier,
        device: data as AndroidManagementDevice,
      });
      break;

    case "ENROLLMENT":
      await saveDeviceStatus({
        enterpriseId,
        deviceIdentifier,
        device: data as AndroidManagementDevice,
      }).then(() => {
        saveDeviceInfoSubscriptions(enterpriseId);
      });
      break;

    case "COMMAND":
      if (!operationName) break;
      await saveDeviceCommand({
        enterpriseId,
        deviceIdentifier,
        operationName,
        devicesOperationData: data as DeviceOperation,
      });
      await syncDeviceInfo(enterpriseId, deviceIdentifier); //紛失モード時のデータ取得に使用
      break;

    case "USAGE_LOGS":
      await saveUsageLogs({
        pubsubMessageId,
        devicesOperationData: data as BatchUsageLogEvents,
      });
      break;
  }

  return data;
};
