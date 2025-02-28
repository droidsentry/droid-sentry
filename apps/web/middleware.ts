import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import AppMiddleware from "./lib/middleware/app-middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const i18nIntelResponse = handleI18nRouting(request);
  // console.log("i18nIntelResponse", i18nIntelResponse);
  const supabaseResponse = NextResponse.next({
    request,
  });
  // console.log("supabaseResponse", supabaseResponse);

  const { response, user } = await updateSession(request, i18nIntelResponse);
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
