/**
 * 紛失モード中のデバイスから位置情報を取得した際のメッセージ
 * 参考URL：https://developers.google.com/android/management/reference/rest/v1/BatchUsageLogEvents?hl=ja#usagelogevent
 */
const usageLogEvent = {
  // デバイスのロック状態関連
  KEYGUARD_DISMISSED: "デバイスのロック画面が解除されました。",
  KEYGUARD_DISMISS_AUTH_ATTEMPT: "デバイスのロック解除が試行されました。",
  KEYGUARD_SECURED:
    "デバイスがロックされました（ユーザーまたは自動タイムアウトによる）。",

  // ファイル操作関連
  FILE_PULLED: "デバイスからファイルがダウンロードされました。",
  FILE_PUSHED: "デバイスにファイルがアップロードされました。",

  // 証明書関連
  CERT_AUTHORITY_INSTALLED:
    "新しいルート証明書がシステムの信頼できる認証情報ストレージにインストールされました。",
  CERT_AUTHORITY_REMOVED:
    "システムの信頼できる認証情報ストレージからルート証明書が削除されました。",
  CERT_VALIDATION_FAILURE: "証明書の検証に失敗しました。",

  // 暗号化関連
  CRYPTO_SELF_TEST_COMPLETED:
    "デバイスの暗号化機能の自己診断テストが完了しました。",
  KEY_DESTRUCTION: "暗号化キーがデバイスから削除されました。",
  KEY_GENERATED: "新しい暗号化キーが生成されました。",
  KEY_IMPORT: "暗号化キーがデバイスにインポートされました。",
  KEY_INTEGRITY_VIOLATION: "暗号化キーの破損が検出されました。",

  // ログ関連
  LOGGING_STARTED: "デバイスのログ記録が開始されました。",
  LOGGING_STOPPED: "デバイスのログ記録が停止されました。",
  LOG_BUFFER_SIZE_CRITICAL:
    "ログバッファが90%に達しました。古いログが削除される可能性があります。",

  // メディア関連
  MEDIA_MOUNT: "リムーバブルメディアがマウントされました。",
  MEDIA_UNMOUNT: "リムーバブルメディアがアンマウントされました。",

  // システム関連
  OS_SHUTDOWN: "デバイスがシャットダウンされました。",
  OS_STARTUP: "デバイスが起動しました。",
  REMOTE_LOCK: "デバイスがリモートでロックされました。",
  WIPE_FAILURE: "デバイスまたは仕事用プロファイルのワイプに失敗しました。",

  // ネットワーク関連
  CONNECT: "TCPネットワーク接続が開始されました。",
  DNS: "DNSルックアップが実行されました。",

  // 紛失モード関連
  LOST_MODE_OUTGOING_PHONE_CALL:
    "紛失モード中のデバイスから通話発信が試行されました。",
  STOP_LOST_MODE_USER_ATTEMPT: "ユーザーが紛失モードの解除を試行しました。",

  // デバイス管理関連
  ENROLLMENT_COMPLETE:
    "デバイスの登録が完了し、すべてのセットアップが完了しました。",

  // ADB関連
  ADB_SHELL_COMMAND: "ADBシェルコマンドが実行されました。",
  ADB_SHELL_INTERACTIVE: "ADBの対話型シェルセッションが開始されました。",
  APP_PROCESS_START: "アプリケーションプロセスが開始されました。",
} as const;

export type usageLogEventType = keyof typeof usageLogEvent;

export const getEventTypeMessage = async (
  eventType: usageLogEventType
): Promise<string> => {
  return usageLogEvent[eventType];
};
