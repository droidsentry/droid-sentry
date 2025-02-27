import { getRequestConfig } from "next-intl/server";

import { Locale } from "@/app.config";
import { cookies, headers } from "next/headers";
import { getUserLocale } from "./locale";

const COOKIE_NAME = "NEXT_LOCALE";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
