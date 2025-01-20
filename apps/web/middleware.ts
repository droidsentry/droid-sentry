import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import AppMiddleware from "./lib/middleware/app-middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
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
