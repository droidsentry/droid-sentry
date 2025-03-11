import "server-only";

import { createClient } from "@/lib/supabase/server";

type ServiceLimitConfig = {
  max_ssids_per_user: {
    table: "wifi_network_configurations";
    errorMessage: string;
  };
  max_devices_kitting_per_user: {
    table: "devices";
    errorMessage: string;
  };
  max_policies_per_user: {
    table: "policies";
    errorMessage: string;
  };
  // 必要に応じて他の制限を追加
};

type ServiceLimitKey = keyof ServiceLimitConfig;

const SERVICE_LIMIT_CONFIG: ServiceLimitConfig = {
  max_ssids_per_user: {
    table: "wifi_network_configurations",
    errorMessage: "SSIDの上限数に達しました",
  },
  max_devices_kitting_per_user: {
    table: "devices",
    errorMessage: "デバイスの上限数に達しました",
  },
  max_policies_per_user: {
    table: "policies",
    errorMessage: "ポリシーの上限数に達しました",
  },
} as const;

/**
 * サービス上限を取得する
 * @param limitKey サービス上限の検索キー
 * @returns サービス上限の値
 */
async function getServiceLimit(limitKey: ServiceLimitKey): Promise<number> {
  const supabase = await createClient();

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

  if (limit === currentCount) {
    throw new Error(config.errorMessage);
  }

  return {
    currentCount,
    limit,
  };
}
