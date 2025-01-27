import "server-only";

import { PubSubMessage } from "../../route";
import { Json } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";

export const savePubSubLogs = async ({
  body,
  pubsubData,
}: {
  body: PubSubMessage;
  pubsubData: Json;
}) => {
  const supabase = createAdminClient();
  const { error } = await supabase.from("pubsub_logs").insert({
    pubsub_data: pubsubData,
    attributes: body.message.attributes,
    message_id: body.message.messageId,
    publish_time: body.message.publishTime,
    ordering_key: body.message.orderingKey,
  });

  if (error) {
    console.error(error);
  }
};
