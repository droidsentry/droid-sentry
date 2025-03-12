"use server";

import { getServiceLimit, SERVICE_LIMIT_CONFIG } from "@/lib/service";
import { createClient } from "@/lib/supabase/server";

/**
 * プロジェクト作成上限チェック
 * @returns 現在の利用状況とサービス上限
 * @throws エラーメッセージ
 */
export const checkProjectLimit = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  // projectsテーブルからユーザーのプロジェクト数を取得する
  const { count: currentCount, error: currentCountError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id);

  if (currentCountError) {
    console.error(currentCountError);
    throw new Error(`現在の利用状況の取得に失敗しました`);
  }

  // サービス上限を取得して確認する
  const limitKey = "max_projects_per_user";
  const limit = await getServiceLimit(limitKey);
  const config = SERVICE_LIMIT_CONFIG[limitKey];

  if (currentCount && currentCount >= limit) {
    throw new Error(config.errorMessage);
  }
  return {
    currentCount,
    limit,
  };
};
/**
 * ユーザー総数上限チェック
 * @returns 現在の利用状況とサービス上限
 * @throws エラーメッセージ
 */
export const checkTotalUserLimit = async () => {
  const limitKey = "max_total_users";
  await getServiceLimit(limitKey);
  return;
};
