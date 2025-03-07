"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { formPolicySchema } from "@/app/schemas/policy";
import { AndroidManagementPolicy, FormPolicy } from "@/app/types/policy";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";

/**
 * ポリシー名が重複しているかどうかを確認
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
  policyIdentifier,
  formData,
}: {
  enterpriseId: string;
  policyIdentifier: string;
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
  if (policyIdentifier === "new") {
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
  const { policyDisplayName, policyData } = result.data;

  // ポリシーを作成
  const androidmanagement = await createAndroidManagementClient();
  if (policyIdentifier === "new") {
    policyIdentifier = uuidv7();
  }
  const requestBody: AndroidManagementPolicy = policyData;

  type Exact<T, U> = T extends U
    ? keyof T extends keyof U
      ? T
      : never
    : never;

  const enterpriseName = `enterprises/${enterpriseId}`;
  const { data } = await androidmanagement.enterprises.policies
    .patch({
      name: `${enterpriseName}/policies/${policyIdentifier}`,
      requestBody: requestBody as Exact<
        AndroidManagementPolicy,
        typeof requestBody
      >,
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
        enterprise_id: enterpriseId,
        policy_identifier: policyIdentifier,
        policy_display_name: policyDisplayName,
        policy_data: data as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "enterprise_id,policy_identifier" }
    )
    .select(
      `
    policy_identifier
    `
    )
    .single();
  if (error) {
    console.error("Error inserting policy:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/${enterpriseId}/policies`);
  return policy.policy_identifier;
};
