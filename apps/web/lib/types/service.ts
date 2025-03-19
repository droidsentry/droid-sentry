/**
 * サービス上限の設定
 * エラーコードはE1001から始まる
 * エラーメッセージはエラーコードに対応するメッセージを設定する
 * E1xxx: サービス制限エラー
 * E2xxx: 認証・権限エラー
 * E3xxx: データベースエラー
 * E4xxx: 入力検証エラー
 * E5xxx: 外部サービス連携エラー
 */
export type ServiceLimitConfig = {
  max_total_users: {
    table: "users";
    errorCode: "E1001";
    errorMessage: string;
  };
  max_projects_per_user: {
    table: "projects";
    errorCode: "E1002";
    errorMessage: string;
  };
  max_devices_kitting_per_user: {
    table: "devices";
    errorCode: "E1003";
    errorMessage: string;
  };
  max_policies_per_user: {
    table: "policies";
    errorCode: "E1004";
    errorMessage: string;
  };
  max_ssids_per_user: {
    table: "wifi_configurations";
    errorCode: "E1005";
    errorMessage: string;
  };
  // 必要に応じて他の制限を追加
};
export type ServiceLimitKey = keyof ServiceLimitConfig;
