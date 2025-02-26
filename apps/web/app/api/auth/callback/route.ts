import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  // URLのクエリパラメータから'code'を取得
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Supabaseクライアントを作成
    const supabase = await createClient();

    // 認証コードをセッションと交換
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // エラーが発生した場合、ホームページにリダイレクト
    if (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  console.log("request.url", request.url);
  // 処理完了後、ホームページにリダイレクト
  return NextResponse.redirect(new URL("/projects", request.url));
}
