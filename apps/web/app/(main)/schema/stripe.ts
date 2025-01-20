import { z } from "zod";

export const SubscriptionDeviceSchema = z.object({
  quantity: z
    .number()
    .min(1, { message: "1以上の数値を入力してください" })
    .max(10000, { message: "10000以下の数値を入力してください" }),
});

/**
 * サブスクリプションのメタデータ
 * 例
 * {
  "plan": {
    "name": "enterprise",           // "free" | "standard" | "premium" | "enterprise"
    "interval": "month",           // "month" | "year"
    "base_features": {
      "device_limit": 100,        // デバイスライセンス数の上限
      "policy_limit": 50,         // 作成可能なポリシー数（デフォルトポリシーを含む）
      "project_limit": 10,        // 作成可能なプロジェクト数
      "project_sharing": true,    // プロジェクト共有機能
      "support": {
        "email": true,            // メールサポート
        "phone": true             // 電話サポート
      }
    },

  },
  "usage": {
    "devices": {
      "total": 0,                 // 現在使用中のデバイス数
      "active": 0,                // アクティブなデバイス数
      "inactive": 0               // 非アクティブなデバイス数
    },
    "policies": {
      "total": 1,                 // 作成済みポリシー総数（デフォルトポリシーを含む）
      "custom": 0                 // カスタムポリシー数（デフォルトポリシーを除く）
    },
    "projects": {
      "total": 0,                 // 現在使用中のプロジェクト数
      "shared": 0                 // 共有されているプロジェクト数
    },
    "pubsub": {
      "monthly_messages": 0,      // 月間メッセージ数
      "monthly_data_transfer": 0, // 月間データ転送量（KB）
      "last_reset": "2024-03-20T00:00:00Z" // 最終リセット日時
    }
  },
  "limits": {
    "pubsub": {
      "max_monthly_messages": 100000,    // 月間最大メッセージ数
      "max_monthly_data_transfer": 1000000, // 月間最大データ転送量（KB）
      "max_message_size": 256           // 最大メッセージサイズ（KB）
    }
  }
}
 */
export const SubscriptionPlanSchema = z.object({
  name: z.enum(["free", "standard", "premium", "enterprise"]), // プラン名
  interval: z.enum(["month", "year"]), // プランの期間
  base_features: z.object({
    device_limit: z.number(), // デバイスライセンス数の上限
    policy_limit: z.number(), // 作成可能なポリシー数（デフォルトポリシーを含む）
    project_limit: z.number(), // 作成可能なプロジェクト数
    project_sharing: z.boolean(), // プロジェクト共有機能
    support: z.object({
      email: z.boolean(), // メールサポート
      phone: z.boolean(), // 電話サポート
    }),
  }),
  usage: z.object({
    devices: z.object({
      total: z.number(), // 現在使用中のデバイス数
      active: z.number(), // アクティブなデバイス数
      inactive: z.number(), // 非アクティブなデバイス数
    }),
    policies: z.object({
      total: z.number(), // 作成済みポリシー総数（デフォルトポリシーを含む）
      custom: z.number(), // カスタムポリシー数（デフォルトポリシーを除く）
    }),
    projects: z.object({
      total: z.number(), // 現在使用中のプロジェクト数
      shared: z.number(), // 共有されているプロジェクト数
    }),
    pubsub: z.object({
      monthly_messages: z.number(), // 月間メッセージ数
      monthly_data_transfer: z.number(), // 月間データ転送量（KB）
      last_reset: z.string(), // 最終リセット日時
    }),
  }),
  limits: z
    .object({
      pubsub: z.object({
        max_monthly_messages: z.number(), // 月間最大メッセージ数
        max_monthly_data_transfer: z.number(), // 月間最大データ転送量（KB）
        max_message_size: z.number(), // 最大メッセージサイズ（KB）
      }),
    })
    .optional()
    .nullable(),
});
