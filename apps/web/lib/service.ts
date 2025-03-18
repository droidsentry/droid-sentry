import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "./supabase/admin";

/**
 * サービス上限の設定
 * エラーコードはE1001から始まる
 * エラーメッセージはエラーコードに対応するメッセージを設定する
 * E1xxx: サービス制限エラー
 * E2xxx: 認証・権限エラー
 * E3xxx: データベースエラー
 * E4xxx: 入力検証エラー
 * E5xxx: 外部サービス連携エラー
 */
type ServiceLimitConfig = {
  max_total_users: {
    table: "users";
    errorCode: "E1001";
    errorMessage: string;
  };
  max_projects_per_user: {
    table: "projects";
    errorCode: "E1002";
    errorMessage: string;
  };
  max_devices_kitting_per_user: {
    table: "devices";
    errorCode: "E1003";
    errorMessage: string;
  };
  max_policies_per_user: {
    table: "policies";
    errorCode: "E1004";
    errorMessage: string;
  };
  max_ssids_per_user: {
    table: "wifi_configurations";
    errorCode: "E1005";
    errorMessage: string;
  };
  // 必要に応じて他の制限を追加
};

type ServiceLimitKey = keyof ServiceLimitConfig;

export const SERVICE_LIMIT_CONFIG: ServiceLimitConfig = {
  max_total_users: {
    table: "users",
    errorCode: "E1001",
    errorMessage: "ユーザーの利用上限数に達しました。",
  },
  max_projects_per_user: {
    table: "projects",
    errorCode: "E1002",
    errorMessage:
      "プロジェクトの利用上限数に達しました。ベータ版は最大３つまで作成することができます。",
  },
  max_devices_kitting_per_user: {
    table: "devices",
    errorCode: "E1003",
    errorMessage:
      "デバイスの利用上限数に達しました。ベータ版では最大５台まで管理することができます。",
  },
  max_policies_per_user: {
    table: "policies",
    errorCode: "E1004",
    errorMessage:
      "ポリシーの利用上限数に達しました。ベータ版では最大100つまで作成することができます。",
  },
  max_ssids_per_user: {
    table: "wifi_configurations",
    errorCode: "E1005",
    errorMessage: "SSIDの上限数に達しました。",
  },
} as const;

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

      const { count: totalUsers, error: totalUsersError } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true });

      if (totalUsersError)
        throw new Error("ユーザーの総数の取得に失敗しました");

      if (totalUsers && totalUsers >= data.max_total_users) {
        // console.log(totalUsers, data.max_total_users);
        throw new Error(SERVICE_LIMIT_CONFIG.max_total_users.errorCode);
      }
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
    throw new Error(config.errorMessage);
  }

  return {
    currentCount,
    limit,
  };
}
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
