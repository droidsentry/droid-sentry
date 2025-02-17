import { createAdminClient } from "@/lib/supabase/admin";
import { sendDiscordWebhookMessage } from "@/lib/webhook/discord";
import { Json } from "@/types/database";
import { NextResponse } from "next/server";

import { BatchUsageLogEvents } from "../../types/event";
import { createCommandDescription } from "./lib/command";
import { dispatchDeviceEvent } from "./lib/data/device-event";
import { createStatusReportDescription } from "./lib/status-report";
import { createUsageLogsDescription } from "./lib/usage-logs";
import { verifyPubSubToken } from "./lib/verify-token";
import { AndroidManagementDevice, DeviceOperation } from "@/app/types/device";
import { savePubSubLogs } from "./lib/data/save-pubsub-logs";

// Pub/Subメッセージの型定義
export interface PubSubMessage {
  message: {
    data: string;
    attributes: {
      notificationType: string;
    };
    messageId: string;
    message_id: string;
    publishTime: string;
    publish_time: string;
    orderingKey: string;
  };
  subscription: string;
}
export type notificationType =
  | "COMMAND" //デバイス コマンドが完了すると送信される通知。
  | "USAGE_LOGS" //デバイスが BatchUsageLogEvents を送信したときに送信される通知。
  | "STATUS_REPORT" //デバイスがステータス レポートを発行したときに送信される通知。
  | "ENROLLMENT" //デバイスが登録されたときに送信される通知。
  | "test"; //enterpriseIdの作成、更新の際、テスト用で送信される通知

/**
 * Pub/Subのメッセージを受信する
 * @param request
 * @returns メッセージの受信結果
 */
export async function POST(request: Request) {
  try {
    // トークンの検証
    await verifyPubSubToken();

    const body: PubSubMessage = await request.json();
    // Base64でエンコードされたデータをデコード
    const decodedData = Buffer.from(body.message.data, "base64").toString();
    const data = JSON.parse(decodedData);
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
    const contentTitle = isProd ? "" : "【開発環境】";
    const supabase = createAdminClient();

    await savePubSubLogs({ body, pubsubData: data });

    // デバイス名の取得ロジックをマッピングオブジェクトで単純化
    const deviceNameExtractors = {
      COMMAND: (data: DeviceOperation) =>
        data.name?.split("/operations/")[0] ?? null,
      USAGE_LOGS: (data: BatchUsageLogEvents) => data.device,
      STATUS_REPORT: (data: AndroidManagementDevice) => data.name,
      ENROLLMENT: (data: AndroidManagementDevice) => data.name,
      test: () => {
        sendDiscordWebhookMessage(
          `${contentTitle}Pub/Subメッセージを受信しました`,
          "test",
          "任意のEnterpriseでPubSubの設定を検知しました。"
        );
        return null;
      },
    } as const;

    // デバイス名の取得とバリデーション
    const notificationType = body.message.attributes
      .notificationType as notificationType;
    const deviceName = deviceNameExtractors[notificationType]?.(data);
    const operationName =
      notificationType === "COMMAND"
        ? data.name?.split("/operations/")[1]
        : undefined;

    let enterpriseId: string | null = null;
    let deviceIdentifier: string | null = null;

    if (deviceName) {
      // enterprises/の後ろの文字列を取得
      const enterpriseParts = deviceName.split("enterprises/")[1] ?? null;
      if (enterpriseParts) {
        // 最初の/までの文字列をenterpriseIdとして取得
        enterpriseId = enterpriseParts.split("/")[0];
        // devices/の後ろの文字列をdeviceIdentifierとして取得
        deviceIdentifier = deviceName.split("/devices/")[1];
      }
    } else {
      // nullのまま処理を続行するとエラーが発生するため、警告を出力して処理を続行
      console.warn("Failed to parse device name:", deviceName);
    }

    const pubsubMessageId = body.message.messageId;
    //pubsub_logsにデータを保存
    const { error } = await supabase.from("pubsub_messages").insert({
      pubsub_message_id: pubsubMessageId,
      enterprise_id: enterpriseId,
      device_identifier: deviceIdentifier,
      notification_type: notificationType,
      pubsub_message_data: data as Json,
      pubsub_message_attributes_data: body.message.attributes,
      publish_time: body.message.publishTime,
    });
    if (error) throw error;
    if (!enterpriseId || !deviceIdentifier) {
      if (notificationType === "test") {
        return NextResponse.json({ status: 200 });
      }
      throw new Error("enterpriseId or deviceIdentifier is null");
    }

    //タイプ別に他のテーブルにも保存する
    const deviceData = await dispatchDeviceEvent({
      enterpriseId,
      deviceIdentifier,
      notificationType,
      data: data as Json,
      operationName,
      pubsubMessageId,
    });

    let description = "";

    // デバイスのステータスレポート取得時、デバイス登録時のメッセージ
    if (
      notificationType === "STATUS_REPORT" ||
      notificationType === "ENROLLMENT"
    ) {
      description = await createStatusReportDescription({
        enterpriseId,
        deviceIdentifier,
        deviceData: deviceData as AndroidManagementDevice,
      });
    }

    // デバイスのコマンド取得時のメッセージ
    if (notificationType === "COMMAND") {
      description = await createCommandDescription({
        enterpriseId,
        deviceIdentifier,
        operationDate: data as DeviceOperation,
      });
    }
    if (notificationType === "USAGE_LOGS") {
      description = await createUsageLogsDescription({
        enterpriseId,
        deviceIdentifier,
        usageLogDate: data as BatchUsageLogEvents,
      });
    }

    await sendDiscordWebhookMessage(
      `${contentTitle}Pub/Subメッセージを受信しました`,
      notificationType,
      description
    );
    // DB

    // 成功レスポンス(ステータスコード200)を返す
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("エラー:", error);
    await sendDiscordWebhookMessage(
      "Pub/Subメッセージのデータ処理に失敗しました。",
      "ERROR",
      error instanceof Error ? error.message : "不明なエラーが発生しました"
    );
    // 500を返すとPub/Subがメッセージを再試行するため202を返す。最適化の可能性あり。
    return NextResponse.json(
      { error: "データ処理に失敗しました。" },
      { status: 202 }
    );
  }
}
