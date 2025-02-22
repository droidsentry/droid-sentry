import { getCurrentLocale } from "@/locales/server";
import { AppConfig } from "@/app.config";

import en from "./en";
import ja from "./ja";
import { MarketingPage, LocaleId } from "@/app/types/locale";

export const getMarketingPage = async () => {
  const data: {
    [key in LocaleId]: MarketingPage;
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
