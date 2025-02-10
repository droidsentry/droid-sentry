import { SiAndroid } from "@icons-pack/react-simple-icons";
import {
  HardDriveIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  WifiHighIcon,
  KeyRoundIcon,
  FileIcon,
  BatteryIcon,
} from "lucide-react";

export const navigationItems = [
  {
    icon: HardDriveIcon,
    title: "ハードウェア情報",
    url: "/hardware",
  },
  {
    icon: ClipboardListIcon,
    title: "ソフトウェア情報",
    url: "/software",
  },
  {
    icon: SiAndroid,
    title: "アプリケーションレポート",
    url: "/application",
  },
  {
    icon: ShieldCheckIcon,
    title: "ポリシー情報",
    url: "/policy",
  },
  {
    icon: WifiHighIcon,
    title: "ネットワーク情報",
    url: "/network",
  },
  {
    icon: KeyRoundIcon,
    title: "セキュリティ情報",
    url: "/security",
  },
  {
    icon: FileIcon,
    title: "ログ",
    url: "/log",
  },
];

export const deviceInfoNavigationItems = [
  {
    icon: HardDriveIcon,
    label: "基本情報",
    url: "base-info",
  },
  {
    icon: HardDriveIcon,
    label: "ハードウェア",
    url: "hardware-info",
  },
  {
    icon: ClipboardListIcon,
    label: "ソフトウェア",
    url: "software-info",
  },
  {
    icon: SiAndroid,
    label: "アプリケーション",
    url: "application-info",
  },
  {
    icon: ShieldCheckIcon,
    label: "ポリシー",
    url: "policy-info",
  },
  {
    icon: WifiHighIcon,
    label: "ネットワーク",
    url: "network-info",
  },
  {
    icon: KeyRoundIcon,
    label: "セキュリティ",
    url: "security-info",
  },
  {
    icon: FileIcon,
    label: "メモリとストレージ",
    url: "memory-and-storage-info",
  },
  {
    icon: BatteryIcon,
    label: "バッテリー",
    url: "battery-info",
  },
  {
    icon: FileIcon,
    label: "ログ",
    url: "log-info",
  },
];
