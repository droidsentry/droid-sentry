"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { formPolicySchema } from "@/lib/schemas/policy";
import { AndroidManagementPolicy, FormPolicy } from "@/lib/types/policy";
import { checkServiceLimit } from "@/lib/service";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { checkDefaultPolicy } from "@/lib/emm/policy";
import { SERVICE_LIMIT_CONFIG } from "@/lib/data/service";
/**
 * ポリシー名が重複しているかどうかを確認
 * @param enterpriseId
 * @param policyDisplayName
 * @returns
 */
export const isPolicyNameUnique = async (
  enterpriseId: string,
  policyDisplayName: string
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  const { data } = await supabase
    .from("policies")
    .select("policy_display_name")
    .eq("enterprise_id", enterpriseId)
    .eq("policy_display_name", policyDisplayName)
    .single();
  return !data;
};

/**
 * ポリシーを更新しDBに保存
 * @param policyId
 * @param policyDisplayName
 * @param enterpriseId
 * @param requestBody
 * @returns
 */
export const createOrUpdatePolicy = async ({
  enterpriseId,
  policyId,
  formData,
}: {
  enterpriseId: string;
  policyId: string;
  formData: FormPolicy;
}) => {
  // ユーザー認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  // 新規作成時のみポリシー名の重複チェック
  if (policyId === "new") {
    const isUnique = await isPolicyNameUnique(
      enterpriseId,
      formData.policyDisplayName
    );
    if (!isUnique) {
      throw new Error("ポリシー名が重複しています");
    }
  }
  // フォームデータの検証
  const result = await formPolicySchema.safeParseAsync(formData);
  if (result.success === false) {
    console.error(result.error);
    throw new Error("フォームデータの検証に失敗しました");
  }
  // サービス上限を確認する
  if (policyId === "new") {
    // サービス上限を確認する
    const limitKey = "max_policies_per_user";
    const isMaxPoliciesPerUser = await checkServiceLimit(
      enterpriseId,
      limitKey
    );
    if (!isMaxPoliciesPerUser) {
      const config = SERVICE_LIMIT_CONFIG[limitKey];
      throw new Error(config.errorMessage);
    }
  }

  const { policyDisplayName, policyDetails } = result.data;
  // ポリシーを作成
  const androidmanagement = await createAndroidManagementClient();
  const requestBody: AndroidManagementPolicy = policyDetails;
  const enterpriseName = `enterprises/${enterpriseId}`;
  let name = `${enterpriseName}/policies/${policyId}`;
  // 新規ポリシーの場合はポリシーIDを生成
  if (policyId === "new") {
    policyId = uuidv7();
    name = `${enterpriseName}/policies/${policyId}`;
  } else {
    // デフォルトポリシーの場合はポリシーIDを"default"に変更
    const idDefaultPolicy = await checkDefaultPolicy(enterpriseId, policyId);
    if (idDefaultPolicy) {
      name = `${enterpriseName}/policies/default`;
    }
  }

  const { data } = await androidmanagement.enterprises.policies
    .patch({
      name,
      requestBody: requestBody,
    })
    .catch((error) => {
      console.error("Error creating policy:", error.message);
      throw new Error(error.message);
    });

  // ポリシーをデータベースに保存と取得
  const { data: policy, error } = await supabase
    .from("policies")
    .upsert(
      {
        policy_id: policyId,
        enterprise_id: enterpriseId,
        policy_display_name: policyDisplayName,
        policy_details: data as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "policy_id" }
    )
    .select(
      `
    policy_id
    `
    )
    .single();
  if (error) {
    console.error("Error inserting policy:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/${enterpriseId}/policies`);
  return policy.policy_id;
};

/**
 * ポリシーを取得
 * @param enterpriseId
 * @returns
 * DBからポリシーを取得
 */
export const getPolicies = async ({
  enterpriseId,
}: {
  enterpriseId: string;
}) => {
  const supabase = await createClient();
  const { data: policies } = await supabase
    .from("policies")
    .select(
      `
      policyId:policy_id,
      policyDisplayName:policy_display_name,
      createdAt:created_at,
      updatedAt:updated_at,
      isDefault:is_default,
      version:policy_details->>version
      `
    )
    .eq("enterprise_id", enterpriseId)
    .order("updated_at", { ascending: true });

  if (!policies) {
    throw new Error("Failed to fetch policies from database");
  }
  // 取得したデータをフロントが期待するPolicy型に変換
  return policies;
};
