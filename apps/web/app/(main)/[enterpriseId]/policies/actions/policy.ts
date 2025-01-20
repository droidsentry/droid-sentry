"use server";

import { createAndroidManagementClient } from "@/actions/emm/client";
import { AndroidManagementPolicy } from "@/app/types/policy";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";

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
  policyDisplayName,
  requestBody,
}: {
  enterpriseId: string;
  policyIdentifier: string;
  policyDisplayName: string;
  requestBody: AndroidManagementPolicy;
}) => {
  // ポリシーを作成
  const androidmanagement = await createAndroidManagementClient();
  if (policyIdentifier === "new") {
    policyIdentifier = uuidv7();
  }
  // console.log("requestBody", requestBody);
  const enterpriseName = `enterprises/${enterpriseId}`;
  const { data } = await androidmanagement.enterprises.policies
    .patch({
      name: `${enterpriseName}/policies/${policyIdentifier}`,
      requestBody,
    })
    .catch((error) => {
      console.error("Error creating policy:", error.message);
      throw new Error(error.message);
    });

  // ポリシーをデータベースに保存と取得
  const supabase = await createClient();
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
