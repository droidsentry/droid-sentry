import { SiGoogleplay } from "@icons-pack/react-simple-icons";
import { GlobeLockIcon, LockIcon, WrenchIcon } from "lucide-react";

/**
 * 管理アプリ種別
 * 下記コンポーネントで使用
 * - apps-sidebar.tsx
 * - management-apps-table-toolbar.tsx
 * - management-apps-columns.tsx
 */
export const appTypeItems = [
  {
    title: "Google Play アプリ",
    label: "Google Play",
    value: "PUBLIC",
    url: "/apps/public",
    icon: SiGoogleplay,
  },
  {
    title: "限定公開 アプリ",
    label: "限定公開",
    value: "PRIVATE",
    url: "/apps/private",
    icon: LockIcon,
  },
  {
    title: "Web アプリ",
    label: "Webアプリ",
    value: "WEB",
    url: "/apps/web",
    icon: GlobeLockIcon,
  },
  {
    title: "カスタム アプリ",
    label: "カスタム",
    value: "CUSTOM",
    url: "/apps/custom",
    icon: WrenchIcon,
  },
];
