import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// import { createTrialSubscription } from "./lib/create-trial-subscription";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error) {
      console.error("サインアップ処理:", error?.message);
      throw new Error("サインアップ処理に失敗しました");
    }
    // ユーザー情報を取得
    const userId = user?.id;
    if (!userId) {
      throw new Error("ユーザーIDが取得できません");
    }
    // ログイン成功時、自動でトライアルサブスクリプションを作成する。
    // await createTrialSubscription(userId).then(() => {
    //   redirect(next);
    // });
    redirect(next);
  }
  redirect("/error");
}
