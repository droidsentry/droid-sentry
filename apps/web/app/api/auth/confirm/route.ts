import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createTrialSubscription } from "./lib/create-trial-subscription";
import { checkAndUpdateUserLimit } from "../lib/user-management";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  // console.log("next", next); //http://localhost:3000/welcome

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
    await checkAndUpdateUserLimit(user);

    /**
     * 確認メール使用した情報を削除
     *  */
    const currentMetadata = user.user_metadata || {};
    console.log("currentMetadata", currentMetadata);
    /**
     * currentMetadata {
  created_at: '2025/03/13 19:08:02（木）',
  email: 't5kuboki@gmail.com',
  email_verified: true,
  ip_address: '::1',
  location: 'unknown',
  phone_verified: false,
  sub: '575ba5b9-cb9f-48d9-958a-430f2df94741',
  username: 't5kuboki'
}
     */
    const { ip_address, location, created_at, ...cleanedMetadata } =
      currentMetadata;
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ip_address: null,
        location: null,
        created_at: null,
      },
    });

    // ユーザーがサブスクリプションを作成しているかどうかを確認
    const hasSubscriptionId = user?.user_metadata?.stripe_customer_id;
    if (!hasSubscriptionId) {
      await createTrialSubscription(userId).then(() => {
        return redirect(next);
      });
    } else {
      return redirect(next);
    }
  }
  redirect("/error");
}
