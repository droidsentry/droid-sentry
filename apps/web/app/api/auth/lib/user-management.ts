import { createAdminClient } from "@/lib/supabase/admin";
import { checkTotalUserLimit } from "@/lib/service";
import { User } from "@supabase/supabase-js";

/**
 * ユーザーの制限チェックを行い、メタデータを更新する関数
 * @param user Supabase認証ユーザー
 * @returns 処理結果のPromise
 */
export async function checkAndUpdateUserLimit(user: User): Promise<void> {
  const userId = user.id;
  const isTotalUserLimit = user?.app_metadata?.is_total_user_limit;
  const supabaseAdmin = createAdminClient();

  if (!isTotalUserLimit) {
    await checkTotalUserLimit()
      .then(async () => {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          app_metadata: {
            is_total_user_limit: true,
          },
        });
      })
      .catch(async (error) => {
        const errorMessage = error?.message;
        if (errorMessage === "E1001") {
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            app_metadata: {
              is_total_user_limit: false,
            },
          });
        }
      });
  }
}
