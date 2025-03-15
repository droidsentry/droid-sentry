import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const requestUrl = new URL(request.url);
//   // URLのクエリパラメータから'code'を取得
//   const code = requestUrl.searchParams.get("code");
//   console.log("request.url", request.url);
//   if (code) {
//     // Supabaseクライアントを作成
//     const supabase = await createClient();
//     // 認証コードをセッションと交換
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     // エラーが発生した場合、ホームページにリダイレクト
//     if (error) {
//       console.error(error.message);
//       return NextResponse.redirect(new URL("/auth-error", request.url));
//     }
//     return NextResponse.redirect(new URL("/projects", request.url));
//   }
//   return NextResponse.redirect(new URL("/auth-error", request.url));
// }

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  console.log("searchParams", searchParams);
  console.log("origin", origin);
  const code = searchParams.get("code");
  console.log("code", code);
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  console.log("next", next);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      console.log("forwardedHost", forwardedHost);
      const isLocalEnv = process.env.NODE_ENV === "development";
      console.log("isLocalEnv", isLocalEnv);
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
