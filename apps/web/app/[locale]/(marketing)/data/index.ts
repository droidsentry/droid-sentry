import { getCurrentLocale } from "@/locales/server";
import { AppConfig, Locale } from "@/app.config";

import en from "./en";
import ja from "./ja";
import { MarketingPage } from "@/app/types/locale";

export const getMarketingPage = async () => {
  const data: {
    [key in Locale]: MarketingPage;
  } = {
    en,
    ja,
  };

  let locale: keyof typeof data;

  try {
    locale = await getCurrentLocale();
  } catch (e) {
    locale = AppConfig.defaultLocale as keyof typeof data;
  }

  return data[locale] as MarketingPage;
};
