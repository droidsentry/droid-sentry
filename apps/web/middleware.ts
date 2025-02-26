import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import AppMiddleware from "./lib/middleware/app-middleware";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  const i18nResponse = I18nMiddleware(request);
  console.log("i18nResponse", i18nResponse);
  const supabaseResponse = NextResponse.next({
    request,
  });
  const xRewriteValue = i18nResponse.headers.get("x-middleware-rewrite");
  if (xRewriteValue) {
    supabaseResponse.headers.append("x-middleware-rewrite", xRewriteValue);
  }
  const xNextLocaleValue = i18nResponse.headers.get("x-next-locale");
  if (xNextLocaleValue) {
    supabaseResponse.headers.append("x-next-locale", xNextLocaleValue);
  }
  console.log("supabaseResponse", supabaseResponse);

  const { response, user } = await updateSession(request, supabaseResponse);
  return AppMiddleware(request, response, user);
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
