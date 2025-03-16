"use server";

import { createClient } from "@/lib/supabase/server";
import {} from "../components/wifi-ssid-table";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { NetworkConfiguration } from "@/app/types/policy-network";
import { NetworkConfigurationSchema } from "@/app/schemas/policy-network";
import { checkServiceLimit } from "@/lib/service";

/**
 * ネットワーク設定を作成または更新する
 * @param enterpriseId 企業ID
 * @param policyIdentifier ポリシーID
 * @param networkConfiguration ネットワーク設定
 */
export const createOrUpdateNetworkConfigurations = async (
  enterpriseId: string,
  policyIdentifier: string,
  networkConfiguration: NetworkConfiguration
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const result = NetworkConfigurationSchema.safeParse(networkConfiguration);
  if (!result.success) {
    console.log(result.error);
    throw new Error("ネットワーク設定の形式が正しくありません");
  }

  // サービス上限を確認する
  await checkServiceLimit(enterpriseId, "max_ssids_per_user");

  const { error } = await supabase
    .from("wifi_network_configurations")
    .upsert(
      {
        wifi_network_configuration_id: networkConfiguration.GUID,
        enterprise_id: enterpriseId,
        config: networkConfiguration as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "wifi_network_configuration_id" }
    )
    .select(
      `
      config
    `
    )
    .single();
  if (error) {
    console.error(error);
    throw new Error("ネットワーク設定の作成に失敗しました");
  }

  revalidatePath(`/${enterpriseId}/policies/${policyIdentifier}/network`);
  return;
};

export const getNetworkConfigurations = async (enterpriseId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  const { data, error } = await supabase
    .from("wifi_network_configurations")
    .select(
      `
      config
    `
    )
    .eq("enterprise_id", enterpriseId);

  if (error) {
    console.error(error);
    throw new Error("ネットワーク設定の取得に失敗しました");
  }
  const networkConfigurations = data.map((item) => {
    const parsedConfig = NetworkConfigurationSchema.parse(item.config);
    return parsedConfig;
  });

  return networkConfigurations;
};

export const deleteNetworkConfiguration = async (
  enterpriseId: string,
  policyIdentifier: string,
  GUID: string
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { error } = await supabase
    .from("wifi_network_configurations")
    .delete()
    .eq("enterprise_id", enterpriseId)
    .eq("wifi_network_configuration_id", GUID);
  if (error) {
    console.error(error);
    throw new Error("ネットワーク設定の削除に失敗しました");
  }
  revalidatePath(`/${enterpriseId}/policies/${policyIdentifier}/network`);
  return;
};

export const deleteNetworkConfigurations = async (
  enterpriseId: string,
  policyIdentifier: string,
  GUIDs: string[]
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { error } = await supabase
    .from("wifi_network_configurations")
    .delete()
    .eq("enterprise_id", enterpriseId)
    .in("wifi_network_configuration_id", GUIDs);
  if (error) {
    console.error(error);
    throw new Error("ネットワーク設定の削除に失敗しました");
  }
  revalidatePath(`/${enterpriseId}/policies/${policyIdentifier}/network`);
  return;
};
