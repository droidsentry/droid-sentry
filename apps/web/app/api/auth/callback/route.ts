import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTrialSubscription } from "../confirm/lib/create-trial-subscription";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  // URLのクエリパラメータから'code'を取得
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Supabaseクライアントを作成
    const supabase = await createClient();

    // 認証コードをセッションと交換
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    // エラーが発生した場合、ホームページにリダイレクト
    if (error) {
      console.error(error.message);
      return NextResponse.redirect(new URL("/", request.url));
    }
    // ユーザー情報を取得
    const userId = user?.id;
    if (!userId) {
      throw new Error("ユーザーIDが取得できません");
    }

    // ユーザーがサブスクリプションを作成しているかどうかを確認
    const hasSubscriptionId = user?.user_metadata?.stripe_customer_id;
    if (!hasSubscriptionId) {
      await createTrialSubscription(userId).then(() => {
        return NextResponse.redirect(new URL("/projects", request.url));
      });
    } else {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }
  return NextResponse.redirect(new URL("/error", request.url));
}
