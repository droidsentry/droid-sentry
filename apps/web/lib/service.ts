import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "./supabase/admin";
import { ServiceLimitKey } from "./types/service";
import { SERVICE_LIMIT_CONFIG } from "./data/service";

/**
 * サービス上限を取得する
 * @param limitKey サービス上限の検索キー
 * @returns サービス上限の値
 */
export async function getServiceLimit(
  limitKey: ServiceLimitKey
): Promise<number> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  switch (limitKey) {
    case "max_ssids_per_user": {
      const { data, error } = await supabase
        .from("service_limits")
        .select("max_ssids_per_user")
        .single();

      if (error) throw new Error("SSIDのサービス上限の取得に失敗しました");
      if (!data?.max_ssids_per_user)
        throw new Error("SSIDのサービス上限が設定されていません");

      return data.max_ssids_per_user;
    }

    case "max_devices_kitting_per_user": {
      const { data, error } = await supabase
        .from("service_limits")
        .select("max_devices_kitting_per_user")
        .single();

      if (error) throw new Error("デバイスのサービス上限の取得に失敗しました");
      if (!data?.max_devices_kitting_per_user)
        throw new Error("デバイスのサービス上限が設定されていません");

      return data.max_devices_kitting_per_user;
    }
    case "max_policies_per_user": {
      const { data, error } = await supabase
        .from("service_limits")
        .select("max_policies_per_user")
        .single();

      if (error) throw new Error("ポリシーのサービス上限の取得に失敗しました");
      if (!data?.max_policies_per_user)
        throw new Error("ポリシーのサービス上限が設定されていません");

      return data.max_policies_per_user;
    }
    case "max_projects_per_user": {
      const { data, error } = await supabase
        .from("service_limits")
        .select("max_projects_per_user")
        .single();

      if (error)
        throw new Error("プロジェクトのサービス上限の取得に失敗しました");
      if (!data?.max_projects_per_user)
        throw new Error("プロジェクトのサービス上限が設定されていません");

      return data.max_projects_per_user;
    }
    case "max_total_users": {
      const { data, error } = await supabaseAdmin
        .from("service_limits")
        .select("max_total_users")
        .single();
      // console.log("max_total_users", data);

      if (error) throw new Error("ユーザーのサービス上限の取得に失敗しました");
      if (!data?.max_total_users)
        throw new Error("ユーザーのサービス上限が設定されていません");

      return data.max_total_users;
    }

    default: {
      throw new Error("未対応のサービス上限タイプです");
    }
  }
}

/**
 * サービス上限をチェックする
 * @param enterpriseId 企業ID
 * @param limitKey サービス上限の検索キー
 * @returns サービス上限を超えている場合はfalse, 超えていない場合はtrue
 */
export async function checkServiceLimit(
  enterpriseId: string,
  limitKey: ServiceLimitKey
) {
  const supabase = await createClient();
  const config = SERVICE_LIMIT_CONFIG[limitKey];

  // 現在の数を取得する
  const { count: currentCount, error: currentCountError } = await supabase
    .from(config.table)
    .select("enterprise_id", { count: "exact", head: true })
    .eq("enterprise_id", enterpriseId);

  if (currentCountError) {
    console.error(currentCountError);
    throw new Error(`現在の利用状況の取得に失敗しました`);
  }

  // サービス上限を取得して確認する
  const limit = await getServiceLimit(limitKey);

  if (currentCount && currentCount >= limit) {
    return false;
  }

  return true;
}
/**
 * ユーザー総数上限チェック
 * @returns 現在の利用状況とサービス上限
 * @throws エラーメッセージ
 */
export const checkTotalUserLimit = async () => {
  const limitKey = "max_total_users";
  const supabaseAdmin = createAdminClient();
  const { count: totalUsers, error: totalUsersError } = await supabaseAdmin
    .from("users")
    .select("*", { count: "exact", head: true });

  if (totalUsersError) throw new Error("ユーザーの総数の取得に失敗しました");

  const maxTotalUsers = await getServiceLimit(limitKey);
  if (totalUsers && totalUsers >= maxTotalUsers) {
    return false;
  }

  return true;
};

/**
 * プロジェクト作成上限チェック
 * @returns サービス上限を超えている場合はfalse, 超えていない場合はtrue
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
    .eq("subscription_owner_id", user.id);

  if (currentCountError) {
    console.error(currentCountError);
    // throw new Error(`現在の利用状況の取得に失敗しました`);
    throw new Error(
      `現在の利用状況の取得に失敗しました: ${currentCountError.message}`
    );
  }

  // サービス上限を取得して確認する
  const limitKey = "max_projects_per_user";
  const limit = await getServiceLimit(limitKey);
  const config = SERVICE_LIMIT_CONFIG[limitKey];

  if (currentCount && currentCount >= limit) {
    return false;
  }
  return true;
};
