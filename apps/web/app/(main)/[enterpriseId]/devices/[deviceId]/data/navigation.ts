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
  // {
  //   icon: SiAndroid,
  //   label: "アプリケーション",
  //   url: "application-info",
  // },
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
  // {
  //   icon: FileIcon,
  //   label: "メモリとストレージ",
  //   url: "memory-and-storage-info",
  // },
  // {
  //   icon: BatteryIcon,
  //   label: "バッテリー",
  //   url: "battery-info",
  // },
  // {
  //   icon: FileIcon,
  //   label: "ログ",
  //   url: "log-info",
  // },
];
