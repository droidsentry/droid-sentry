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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // console.log("code", code);
  // console.log("origin", origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/projects`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
