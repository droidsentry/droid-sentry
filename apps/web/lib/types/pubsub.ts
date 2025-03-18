import { androidmanagement_v1 } from "googleapis";

export type PubSubMessage = {
  message: {
    data: string;
    attributes: {
      notificationType: string;
    };
    messageId: string;
    message_id: string;
    publishTime: string;
    publish_time: string;
    orderingKey?: string;
  };
  subscription: string;
};
export type NotificationType =
  | "COMMAND" //デバイス コマンドが完了すると送信される通知。
  | "USAGE_LOGS" //デバイスが BatchUsageLogEvents を送信したときに送信される通知。
  | "STATUS_REPORT" //デバイスがステータス レポートを発行したときに送信される通知。
  | "ENROLLMENT" //デバイスが登録されたときに送信される通知。
  | "test"; //enterpriseIdの作成、更新の際、テスト用で送信される通知

export type BatchUsageLogEvents =
  androidmanagement_v1.Schema$BatchUsageLogEvents;
