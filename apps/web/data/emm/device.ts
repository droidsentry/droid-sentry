export const deviceOwnership = [
  {
    value: "OWNERSHIP_UNSPECIFIED",
    label: "所有権の指定なし",
  },
  {
    value: "COMPANY_OWNED",
    label: "会社所有",
  },
  {
    value: "PERSONALLY_OWNED",
    label: "個人所有",
  },
];
export const deviceManagementMode = [
  {
    value: "DEVICE_OWNER",
    label: "デバイスオーナー",
  },
  {
    value: "PROFILE_OWNER",
    label: "プロフィールオーナー",
  },
];
export const deviceUpdateStatus = [
  {
    value: "UPDATE_STATUS_UNKNOWN",
    label: "不明",
  },
  {
    value: "UP_TO_DATE",
    label: "アップデートなし",
  },
  {
    value: "UNKNOWN_UPDATE_AVAILABLE",
    label: "保留中のシステムアップデートがあります",
  },
  {
    value: "SECURITY_UPDATE_AVAILABLE",
    label: "保留中のセキュリティアップデートがあります",
  },
  {
    value: "OS_UPDATE_AVAILABLE",
    label: "保留中のOSアップデートがあります",
  },
];

export const encryptionStatus = [
  {
    value: "ENCRYPTION_STATUS_UNSPECIFIED",
    label: "指定なし",
  },
  {
    value: "UNSPECIFIED",
    label: "暗号化がサポートされていません。",
  },
  {
    value: "INACTIVE",
    label: "暗号化がサポートされていますが、現在は暗号化されていません。",
  },
  {
    value: "ACTIVATING",
    label: "暗号化を実行中です。",
  },
  {
    value: "ACTIVE",
    label: "暗号化されています。",
  },
  {
    value: "ACTIVE_DEFAULT_KEY",
    label: "暗号化されていますが、暗号鍵はユーザーによって設定されていません。",
  },
  {
    value: "ACTIVE_PER_USER",
    label:
      "暗号化されていて、かつ、暗号鍵はユーザープロファイルに関連付けされています。",
  },
];
export const devicePosture = [
  {
    value: "POSTURE_UNSPECIFIED",
    label: "-",
  },
  {
    value: "SECURE",
    label: "安全です。",
  },
  {
    value: "AT_RISK",
    label: "悪意のある攻撃者に対して脆弱である可能性があります。",
  },
  {
    value: "POTENTIALLY_COMPROMISED",
    label: "潜在的に侵害されている可能性があります。",
  },
];
export const securityRisk = [
  {
    value: "SECURITY_RISK_UNSPECIFIED",
    label: "-",
  },
  {
    value: "UNKNOWN_OS",
    label:
      "Play Integrity APIにより、不明なOSが検出されています。(basiclntegrityのチェックは成功していますが、ctsProfileMatchが失敗しています。)",
  },
  {
    value: "COMPROMISED_OS",
    label:
      "Play Integrity APIにより、侵害されたOSが検出されています。(basiclntegrityのチェックが失敗しています。)",
  },
  {
    value: "HARDWARE_BACKED_EVALUATION_FAILED",
    label:
      "Play Integrity APIにより、ハードウェアの「デバイスの完全性フィールド」に「MEET_IN_THE_MIDDLE」が設定されていないことが確認されています。",
  },
];
