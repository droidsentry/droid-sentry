"use server";

import { formPolicySchema } from "@/app/schemas/policy";
import { createClient } from "@/lib/supabase/server";
// import { PolicyForm } from "@/app/(main)/types/policy";

/**
 * ポリシー情報をDBから取得
 * @param policyIdentifier
 * @returns policy_config_data
 */
export const getPolicyData = async (
  enterpriseId: string,
  policyIdentifier: string
) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("policies")
    .select(
      `
      policyDisplayName:policy_display_name,
      policyData:policy_data
      `
    )
    .match({ enterprise_id: enterpriseId, policy_identifier: policyIdentifier })
    .single();
  if (!data) {
    throw new Error("Policy not found");
  }
  const response = formPolicySchema.parse(data);

  return response;
};
