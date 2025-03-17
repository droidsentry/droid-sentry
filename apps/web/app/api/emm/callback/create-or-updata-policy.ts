import "server-only";

import { AndroidManagementPolicy } from "@/app/types/policy";
import { defaultPolicyRequestBody } from "@/data/default-policy-request-body";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { createAndroidManagementClient } from "../../../../lib/emm/client";
import { v7 as uuidv7 } from "uuid";

export const patchPolicy = async (
  enterpriseId: string,
  requestBody: AndroidManagementPolicy
) => {
  const name = `enterprises/${enterpriseId}/policies/default`;

  const androidmanagement = await createAndroidManagementClient();
  const { data } = await androidmanagement.enterprises.policies
    .patch({
      name,
      requestBody,
    })
    .catch((error) => {
      console.error("Error creating signup URL:", error.message);
      throw new Error(error.message);
    });
  if (!data) {
    throw new Error("Failed to patch policy");
  }
  return data;
};

// ポリシーをDBに保存
const savePolicyToDB = async (
  enterpriseId: string,
  response: AndroidManagementPolicy
) => {
  // 既存のデフォルトポリシーを確認
  const supabase = await createClient();
  const { data: existingDefaultPolicy, error: existingDefaultPolicyError } =
    await supabase
      .from("policies")
      .select("*")
      .eq("enterprise_id", enterpriseId)
      .eq("is_default", true)
      .maybeSingle();

  if (existingDefaultPolicyError) {
    console.error(
      "Error getting existing default policy:",
      existingDefaultPolicyError
    );
    throw new Error("Error getting existing default policy");
  }

  if (existingDefaultPolicy) {
    const policyId = existingDefaultPolicy.policy_id;
    // 既存のデフォルトポリシーを更新
    const { data, error } = await supabase
      .from("policies")
      .update({
        policy_data: response as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("policy_id", policyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating policy:", error);
      throw new Error("Error updating policy");
    }
    return { data };
  } else {
    // ポリシー情報をDBに保存
    const policyId = uuidv7();
    const { data, error } = await supabase
      .from("policies")
      .insert({
        policy_id: policyId,
        enterprise_id: enterpriseId,
        policy_display_name: "デフォルトポリシー",
        policy_details: response as Json,
        is_default: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) {
      console.error("Error saving policy:", error);
      throw new Error("Error saving policy");
    }
    return { data };
  }
};

export const createDefaultPolicy = async (enterpriseId: string) => {
  // ユーザー認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  // ポリシー作成,または、更新
  const requestBody: AndroidManagementPolicy = defaultPolicyRequestBody;
  const response = await patchPolicy(enterpriseId, requestBody);

  // ポリシーをpoliciesテーブルに保存
  const { data } = await savePolicyToDB(enterpriseId, response);

  // 応答文を　policies_historiesテーブルに保存
  const { error: policyHistoryError } = await supabase
    .from("policy_history")
    .insert({
      policy_id: data.policy_id,
      request_details: requestBody as Json,
      response_details: response as Json,
    });
  if (policyHistoryError) {
    console.error("Error inserting policy_history:", policyHistoryError);
    throw new Error("Error inserting policy_history");
  }
};
