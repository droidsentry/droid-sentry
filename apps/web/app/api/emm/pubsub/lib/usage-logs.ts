import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { BatchUsageLogEvents } from "../../../../types/pubsub";
import { getDeviceDisplayName } from "@/lib/device";
import {
  getEventTypeMessage,
  usageLogEventType,
} from "./data/usage-log-evnet-type-code-ja";

export const createUsageLogsDescription = async ({
  enterpriseId,
  deviceId,
  usageLogDate,
}: {
  enterpriseId: string;
  deviceId: string;
  usageLogDate: BatchUsageLogEvents;
}) => {
  const deviceDisplayName =
    (await getDeviceDisplayName(enterpriseId, deviceId)) ?? "不明";

  const usageLogEvents = usageLogDate.usageLogEvents;
  if (!usageLogEvents) {
    return "イベントが見つかりません。";
  }

  const events = await Promise.all(
    usageLogEvents.map(async (event) => {
      const eventType = event.eventType;

      if (!eventType) {
        throw new Error(`Invalid usage log event data.`);
      }

      let eventTime = "不明";
      if (event.eventTime) {
        eventTime = formatToJapaneseDateTime(Date.parse(event.eventTime));
      }
      if (eventType === "LOST_MODE_LOCATION") {
        const lat = event.lostModeLocationEvent?.location?.latitude;
        const lng = event.lostModeLocationEvent?.location?.longitude;
        return `
      デバイスID: ${deviceId}
      デバイス名: ${deviceDisplayName}
      取得日時: ${eventTime}
      紛失モード中のデバイスから位置情報を取得しました。
      緯度: ${lat}
      経度: ${lng}
      https://www.google.com/maps/search/?api=1&query=${lat},${lng}
      `;
      }
      const eventTypeMessage = await getEventTypeMessage(
        eventType as usageLogEventType
      );
      if (eventTypeMessage) {
        return `
      デバイスID: ${deviceId}
      デバイス名: ${deviceDisplayName}
      取得日時: ${eventTime}
      イベント: ${eventTypeMessage}
      `;
      }

      return `${event.eventType}`;
    })
  );
  // const eventContent = await Promise.all([events]);
  const description = events?.join("\n");
  return description ?? "不明なイベントです。";
};
