import "server-only";
import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";

/**
 * デフォルトポリシーかどうかを確認
 * @param enterpriseId
 * @param policyId
 * @returns
 */
export const checkDefaultPolicy = async (
  enterpriseId: string,
  policyId: string
) => {
  const supabase = await createClient();
  const { data: policy, error } = await supabase
    .from("policies")
    .select("isDefault:is_default")
    .match({
      enterprise_id: enterpriseId,
      policy_id: policyId,
    })
    .single();
  if (error) {
    throw new Error("Failed to check default policy");
  }
  return policy.isDefault;
};

/**
 * デフォルトポリシーのIDを取得
 * @param enterpriseId
 * @returns
 * PubsubでデフォルトポリシーのIDを取得するための関数
 * adminクライアントを使用しているため、使用する際は注意が必要
 */
export const getDefaultPolicyId = async (enterpriseId: string) => {
  const supabase = createAdminClient();
  const { data: policy, error } = await supabase
    .from("policies")
    .select("policyId:policy_id")
    .match({
      enterprise_id: enterpriseId,
      is_default: true,
    })
    .single();
  if (error) {
    throw new Error("Failed to check default policy");
  }
  return policy.policyId;
};
