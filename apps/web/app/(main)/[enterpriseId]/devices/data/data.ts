import {
  CheckCircle,
  CircleOff,
  Clock,
  HelpCircle,
  Timer,
  Vibrate,
  XCircle,
} from "lucide-react";

// export const labels = [
//   {
//     value: "bug",
//     label: "Bug",
//   },
//   {
//     value: "feature",
//     label: "Feature",
//   },
//   {
//     value: "documentation",
//     label: "Documentation",
//   },
// ];

/**
 * デバイスのステータス
 * https://developers.google.com/android/management/reference/rest/v1/enterprises.devices?hl=ja#DeviceState
 */
export const deviceStates = [
  {
    value: "UNSPECIFIED",
    label: "未指定",
    icon: HelpCircle,
    color: "text-gray-400",
  },
  {
    value: "ACTIVE",
    label: "アクティブ",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    value: "DISABLED",
    label: "無効",
    icon: CircleOff,
    color: "text-orange-500",
  },
  {
    value: "DELETED",
    label: "削除済み",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    value: "PROVISIONING",
    label: "プロビジョニング中",
    icon: Timer,
    color: "text-blue-500",
  },
  {
    value: "LOST",
    label: "紛失",
    icon: Vibrate,
    color: "text-yellow-500",
  },
  {
    value: "PREPARING_FOR_MIGRATION",
    label: "移行準備中",
    icon: Clock,
    color: "text-purple-500",
  },
  {
    value: "DEACTIVATED_BY_DEVICE_FINANCE",
    label: "デバイスファイナンスにより無効化",
    icon: CircleOff,
    color: "text-orange-500",
  },
];

/**
 * デバイスのアップデートステータス
 * https://developers.google.com/android/management/reference/rest/v1/enterprises.devices
 */
export const updateStatuses = [
  {
    value: "UPDATE_STATUS_UNKNOWN",
    label: "Unknown",
    icon: HelpCircle,
    description: "保留中のシステム アップデートの状態が不明",
  },
  {
    value: "UP_TO_DATE",
    label: "Up to Date",
    icon: CheckCircle,
    description: "利用可能なアップデートなし",
  },
  {
    value: "UNKNOWN_UPDATE_AVAILABLE",
    label: "Update Available (Type Unknown)",
    icon: Clock,
    description: "不明なタイプのアップデートが利用可能",
  },
  {
    value: "SECURITY_UPDATE_AVAILABLE",
    label: "Security Update Available",
    icon: Timer,
    description: "セキュリティアップデートが利用可能",
  },
  {
    value: "OS_UPDATE_AVAILABLE",
    label: "OS Update Available",
    icon: Timer,
    description: "OSアップデートが利用可能",
  },
];

// export const statuses = [
//   {
//     value: "pending",
//     label: "Pending",
//     icon: Circle,
//   },
//   {
//     value: "processing",
//     label: "Processing",
//     icon: Clock,
//   },
//   {
//     value: "success",
//     label: "Success",
//     icon: CheckCircle,
//   },
//   {
//     value: "failed",
//     label: "Failed",
//     icon: XCircle,
//   },
// ];

// export const priorities = [
//   {
//     label: "Low",
//     value: "low",
//     icon: ArrowDown,
//   },
//   {
//     label: "Medium",
//     value: "medium",
//     icon: ArrowRight,
//   },
//   {
//     label: "High",
//     value: "high",
//     icon: ArrowUp,
//   },
// ];
