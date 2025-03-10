"use server";

import { createClient } from "@/lib/supabase/server";
import {
  NetworkConfigurations,
  NetworkConfigurationSchema,
} from "../components/wifi-ssid-table";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

export const createOrUpdateNetworkConfigurations = async (
  enterpriseId: string,
  policyIdentifier: string,
  networkConfigurations: NetworkConfigurations
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const result = await NetworkConfigurationSchema.safeParseAsync(
    networkConfigurations
  );
  if (!result.success) {
    throw new Error("ネットワーク設定の形式が正しくありません");
  }

  const { data, error } = await supabase
    .from("wifi_network_configurations")
    .upsert(
      {
        enterprise_id: enterpriseId,
        config: networkConfigurations as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "enterprise_id" }
    )
    .select(
      `
      config
    `
    )
    .single();
  if (error) {
    throw new Error("ネットワーク設定の作成に失敗しました");
  }
  const parsedConfig = NetworkConfigurationSchema.parse(data.config);

  revalidatePath(`/${enterpriseId}/policies/${policyIdentifier}/network`);
  return parsedConfig;
};
