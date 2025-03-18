import "server-only";

import { sendDiscordWebhookMessage } from "@/lib/webhook/discord";

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const contentTitle = isProd ? "" : "【開発環境】";

export const sendWebhookMessage = (
  type: string,
  description?: string,
  title?: string
) => {
  switch (type) {
    case "ERROR":
      sendDiscordWebhookMessage(
        `${contentTitle}${title}`,
        "ERROR",
        description
      );
      break;

    case "test":
      sendDiscordWebhookMessage(
        `${contentTitle}Pub/Subメッセージを受信しました`,
        "test",
        "任意のEnterpriseでPubSubの設定を検知しました。"
      );
      break;

    default:
      sendDiscordWebhookMessage(
        `${contentTitle}Pub/Subメッセージを受信しました`,
        type,
        description
      );

      break;
  }
};
