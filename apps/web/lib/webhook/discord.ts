// Discord Webhook用の型定義
type DiscordWebhookPayload = {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number; // 16進数のカラーコード
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
  }>;
};

/**
 * Discordにメッセージを送信する
 * @param content メッセージ内容
 * @param title タイトル（オプション）
 * @param description 説明（オプション）
 * @returns レスポンス
 */
export const sendDiscordWebhookMessage = async (
  content: string,
  notificationType: string,
  description?: string
) => {
  const WEBHOOK_URL = process.env.DISCORD_PUBSUB_WEBHOOK_URL;
  if (!WEBHOOK_URL) throw new Error("Discord Webhook URL is not defined");

  const NOTIFICATION_COLORS = {
    STATUS_REPORT: 0x00ff00, // 緑
    COMMAND: 0xffff00, // 黄
    ENROLLMENT: 0x0000ff, // 青
    USAGE_LOGS: 0xff00ff, // マゼンタ
    test: 0xa78bfa, // 薄い青色
  } as const;

  const color =
    NOTIFICATION_COLORS[notificationType as keyof typeof NOTIFICATION_COLORS] ??
    0xff0000; // デフォルト: 赤

  const payload: DiscordWebhookPayload = {
    content,
    embeds: [
      {
        title: notificationType,
        description: description || content,
        color,
      },
    ],
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch((error) => {
    console.error(error);
  });
};
