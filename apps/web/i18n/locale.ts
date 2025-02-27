"use server";

import { AppConfig, Locale } from "@/app.config";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;
  let locale = cookieLocale as Locale;

  if (!cookieLocale) {
    const browserLocale = (await headers())
      .get("accept-language")
      ?.split(",")[0];
    locale = browserLocale === "ja" ? "ja" : "en";
    // cookieStore.set(COOKIE_NAME, locale);
  }
  return locale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
