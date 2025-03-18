"use server";

import { formPolicySchema } from "@/lib/schemas/policy";
import { createClient } from "@/lib/supabase/server";
// import { PolicyForm } from "@/app/(main)/types/policy";

/**
 * ポリシー情報をDBから取得
 * @param enterpriseId
 * @param policyId
 * @returns
 */
export const getPolicyData = async (enterpriseId: string, policyId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("policies")
    .select(
      `
      policyDisplayName:policy_display_name,
      policyDetails:policy_details
      `
    )
    .match({ enterprise_id: enterpriseId, policy_id: policyId })
    .single();
  if (!data) {
    throw new Error("ポリシーが見つかりません");
  }
  // const response = formPolicySchema.parse(data);
  const parsed = formPolicySchema.safeParse(data);
  if (!parsed.success) {
    console.error("response.error", parsed.error);
    throw new Error("ポリシー情報の取得に失敗しました");
  }

  return parsed.data;
};
