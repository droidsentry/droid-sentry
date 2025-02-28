import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { AppConfig, defaultLocale } from "@/app.config";

const supportedLocales = AppConfig.locales;

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale,
});

// Next.jsのナビゲーションAPIの軽量ラッパー
// ルーティング設定を考慮します
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
