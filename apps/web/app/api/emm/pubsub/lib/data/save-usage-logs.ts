import "server-only";

import { BatchUsageLogEvents } from "@/app/api/types/event";
import { createAdminClient } from "@/lib/supabase/admin";
import { Json } from "@/types/database";

/**
 * デバイスの使用ログを保存する
 * @param pubsubMessageId
 * @param devicesOperationData
 * usageLogEventsのデータはオプジェクトが配列で返ってくる可能性があるため、
 * オブジェクトごとにデータを保存する。
 */
export const saveUsageLogs = async ({
  pubsubMessageId,
  devicesOperationData,
}: {
  pubsubMessageId: string;
  devicesOperationData: BatchUsageLogEvents;
}) => {
  const usageLogEvents = devicesOperationData.usageLogEvents;
  const usageLogEventData = usageLogEvents
    ?.map((usageLogEvent) => {
      const eventTime = usageLogEvent.eventTime;
      const eventType = usageLogEvent.eventType;
      const eventData = usageLogEvent as Json;

      if (!eventTime || !eventType || !eventData) {
        throw new Error(`Invalid usage log event data.
          ${JSON.stringify(usageLogEvent)}`);
      }
      return {
        pubsub_message_id: pubsubMessageId,
        usage_log_event_time: eventTime,
        usage_log_event_type: eventType,
        usage_log_event_data: eventData,
      };
    })
    .filter((data): data is NonNullable<typeof data> => data !== null);

  if (!usageLogEventData) {
    throw new Error(`Invalid usage log event data.`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("usage_log_events")
    .insert(usageLogEventData);
  if (error) {
    console.error(error);
    console.log("usageLogEvents", usageLogEvents);
    throw new Error(`Failed to save usage log events.
      error: ${error.message}`);
  }
};
