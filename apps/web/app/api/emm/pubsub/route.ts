import { createAdminClient } from "@/lib/supabase/admin";
import { sendDiscordWebhookMessage } from "@/lib/webhook/discord";
import { Json } from "@/types/database";
import { NextResponse } from "next/server";

import {
  BatchUsageLogEvents,
  NotificationType,
  PubSubMessage,
} from "../../../types/pubsub";
import { createCommandDescription } from "./lib/command";
import { dispatchDeviceEvent } from "./lib/device-event";
import { createStatusReportDescription } from "./lib/status-report";
import { createUsageLogsDescription } from "./lib/usage-logs";
import { verifyPubSubToken } from "./lib/verify-token";
import { AndroidManagementDevice, DeviceOperation } from "@/app/types/device";
import { savePubSubLogs } from "./lib/save-pubsub-logs";
import { sendWebhookMessage } from "./lib/send-webhoook";

/**
 * Pub/Subのメッセージを受信する
 * @param request
 * @returns メッセージの受信結果
 */
export async function POST(request: Request) {
  try {
    // トークンの検証
    await verifyPubSubToken();

    let body: PubSubMessage;
    try {
      body = await request.json();
    } catch (error) {
      console.error("JSON parse error:", error);
      throw new Error("Invalid JSON in request body");
    }

    // リクエストボディの基本的なバリデーション
    if (!body?.message?.data) {
      console.log("body", body);
      throw new Error("Invalid message format: missing required fields");
    }

    // Base64でエンコードされたデータをデコード
    let data;
    try {
      const decodedData = Buffer.from(body.message.data, "base64").toString();
      data = JSON.parse(decodedData);
    } catch (error) {
      console.error("Base64 decode or JSON parse error:", error);
      throw new Error("Failed to decode message data");
    }
    //pubsub_message_logsにデータを保存
    await savePubSubLogs({ body, pubsubData: data });

    const deviceNameExtractors = {
      COMMAND: (data: DeviceOperation) =>
        data.name?.split("/operations/")[0] ?? null,
      USAGE_LOGS: (data: BatchUsageLogEvents) => data.device,
      STATUS_REPORT: (data: AndroidManagementDevice) => data.name,
      ENROLLMENT: (data: AndroidManagementDevice) => data.name,
      test: () => {
        sendWebhookMessage("test");
        return null;
      },
    } as const;

    // デバイス名の取得とバリデーション
    const notificationType = body.message.attributes
      .notificationType as NotificationType;
    const deviceName = deviceNameExtractors[notificationType]?.(data);
    const operationName =
      notificationType === "COMMAND"
        ? data.name?.split("/operations/")[1]
        : undefined;

    let enterpriseId: string | null = null;
    let deviceId: string | null = null;

    if (deviceName) {
      const enterpriseParts = deviceName.split("enterprises/")[1] ?? null;
      if (enterpriseParts) {
        enterpriseId = enterpriseParts.split("/")[0];
        deviceId = deviceName.split("/devices/")[1];
      }
    } else {
      // nullのまま処理を続行するとエラーが発生するため、警告を出力して処理を続行
      console.warn("Failed to parse device name:", deviceName);
    }

    const messageId = body.message.messageId;
    //pubsub_logsにデータを保存
    const supabase = createAdminClient();
    const { error } = await supabase.from("pubsub_messages").insert({
      message_id: messageId,
      enterprise_id: enterpriseId,
      device_id: deviceId,
      notification_type: notificationType,
      message: data as Json,
      message_attributes: body.message.attributes,
      publish_time: body.message.publishTime,
    });
    if (error) {
      console.error(error);
      throw new Error("Failed to save pubsub message to database");
    }

    if (!enterpriseId || !deviceId) {
      if (notificationType === "test") {
        return NextResponse.json({ status: 200 });
      }
      throw new Error("enterpriseId or deviceId is null");
    }

    //タイプ別に他のテーブルにも保存する
    const deviceData = await dispatchDeviceEvent({
      enterpriseId,
      deviceId,
      notificationType,
      data: data as Json,
      operationName,
      messageId,
    });

    let description = "";

    // デバイスのステータスレポート取得時、デバイス登録時のメッセージ
    if (
      notificationType === "STATUS_REPORT" ||
      notificationType === "ENROLLMENT"
    ) {
      description = await createStatusReportDescription({
        enterpriseId,
        deviceId,
        deviceData: deviceData as AndroidManagementDevice,
      });
    }

    // デバイスのコマンド取得時のメッセージ
    if (notificationType === "COMMAND") {
      description = await createCommandDescription({
        enterpriseId,
        deviceId,
        operationDate: data as DeviceOperation,
      });
    }
    if (notificationType === "USAGE_LOGS") {
      description = await createUsageLogsDescription({
        enterpriseId,
        deviceId,
        usageLogDate: data as BatchUsageLogEvents,
      });
    }
    sendWebhookMessage(notificationType, description);

    // 成功レスポンス(ステータスコード200)を返す
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("エラー:", error);
    const title = "Pub/Subメッセージのデータ処理に失敗しました。";
    const description =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    sendWebhookMessage("ERROR", description, title);

    // 500を返すとPub/Subがメッセージを再試行するため202を返す。最適化の可能性あり。
    return NextResponse.json(
      { error: "データ処理に失敗しました。" },
      { status: 202 }
    );
  }
}
