import {
  AppWindowIcon,
  FilePlusIcon,
  HistoryIcon,
  LayoutListIcon,
  NetworkIcon,
  SearchIcon,
} from "lucide-react";
import { SiGooglechrome, SiGoogleplay } from "@icons-pack/react-simple-icons";

// Menu items.
export const policyListItems = [
  {
    title: "リスト",
    url: "",
    icon: LayoutListIcon,
  },
  {
    title: "詳細検索",
    url: "search",
    icon: SearchIcon,
  },
  {
    title: "履歴",
    url: "history",
    icon: HistoryIcon,
  },
  {
    title: "作成ログ",
    url: "create-log",
    icon: FilePlusIcon,
  },
];
export const policyDetailItems = [
  {
    title: "端末全般",
    url: "device-general",
    icon: LayoutListIcon,
  },
  {
    title: "画面ロック",
    url: "lock-screen",
    icon: SearchIcon,
  },
  {
    title: "ネットワーク",
    url: "network",
    icon: NetworkIcon,
  },
  {
    title: "Google Play",
    url: "google-play",
    icon: SiGoogleplay,
  },
  {
    title: "アプリケーション",
    url: "application",
    icon: AppWindowIcon,
  },
  {
    title: "Chrome ブラウザ",
    url: "chrome-browser",
    icon: SiGooglechrome,
  },
  {
    title: "操作ログ",
    url: "operation-log",
    icon: FilePlusIcon,
  },
];
export const scheduleDeliveryItems = [
  {
    title: "スケジュール一覧",
    url: "schedule-list",
    icon: LayoutListIcon,
  },
  {
    title: "配信ログ",
    url: "delivery-log",
    icon: SearchIcon,
  },
];
