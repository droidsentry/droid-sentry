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
    url: "hardware",
  },
  {
    icon: ClipboardListIcon,
    label: "ソフトウェア",
    url: "software",
  },
  {
    icon: SiAndroid,
    label: "アプリケーションレポート",
    url: "application",
  },
  {
    icon: ShieldCheckIcon,
    label: "ポリシー",
    url: "policy",
  },
  {
    icon: WifiHighIcon,
    label: "ネットワーク",
    url: "network",
  },
  {
    icon: KeyRoundIcon,
    label: "セキュリティ",
    url: "security",
  },
  {
    icon: FileIcon,
    label: "メモリとストレージ",
    url: "memory",
  },
  {
    icon: BatteryIcon,
    label: "バッテリー",
    url: "battery",
  },
  {
    icon: FileIcon,
    label: "ログ",
    url: "log",
  },
];
