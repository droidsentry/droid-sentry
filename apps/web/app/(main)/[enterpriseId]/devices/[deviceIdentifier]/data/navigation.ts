import { SiAndroid } from "@icons-pack/react-simple-icons";
import {
  HardDriveIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  WifiHighIcon,
  KeyRoundIcon,
  FileIcon,
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
