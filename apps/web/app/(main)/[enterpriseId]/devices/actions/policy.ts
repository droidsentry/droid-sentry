"use server";

import { createClient } from "@/lib/supabase/server";

export const getPolicyList = async (enterpriseId: string) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
      policyId:policy_id,
      policyIdentifier:policy_identifier,
      policyDisplayName:policy_display_name
    `
    )
    .eq("enterprise_id", enterpriseId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 *     created_at: string;
    enterprise_id: string;
    policy_data: Json;
    policy_display_name: string;
    policy_id: string;
    policy_identifier: string;
    updated_at: string;
 */
