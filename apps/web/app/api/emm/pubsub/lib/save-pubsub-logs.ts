import "server-only";

import { Json } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { PubSubMessage } from "@/lib/types/pubsub";

export const savePubSubLogs = async ({
  body,
  pubsubData,
}: {
  body: PubSubMessage;
  pubsubData: Json;
}) => {
  const supabase = createAdminClient();
  const { error } = await supabase.from("pubsub_message_logs").insert({
    message: pubsubData,
    message_attributes: body.message.attributes,
    message_id: body.message.messageId,
    publish_time: body.message.publishTime,
    ordering_key: body.message.orderingKey,
  });

  if (error) {
    console.error(error);
  }
};
