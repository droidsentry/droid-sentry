import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ip_address: null,
        location: null,
        created_at: null,
      },
    });

    return redirect(next);
  }
  redirect("/auth/error");
}
