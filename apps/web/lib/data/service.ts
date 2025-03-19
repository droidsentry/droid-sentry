import { ServiceLimitConfig } from "../types/service";

export const SERVICE_LIMIT_CONFIG: ServiceLimitConfig = {
  max_total_users: {
    table: "users",
    errorCode: "E1001",
    errorMessage: "ユーザーの利用上限数に達しました。",
  },
  max_projects_per_user: {
    table: "projects",
    errorCode: "E1002",
    errorMessage:
      "プロジェクトの利用上限数に達しました。ベータ版は最大３つまで作成することができます。",
  },
  max_devices_kitting_per_user: {
    table: "devices",
    errorCode: "E1003",
    errorMessage:
      "デバイスの利用上限数に達しました。ベータ版では最大５台まで管理することができます。",
  },
  max_policies_per_user: {
    table: "policies",
    errorCode: "E1004",
    errorMessage:
      "ポリシーの利用上限数に達しました。ベータ版では最大100つまで作成することができます。",
  },
  max_ssids_per_user: {
    table: "wifi_configurations",
    errorCode: "E1005",
    errorMessage: "SSIDの上限数に達しました。",
  },
} as const;
