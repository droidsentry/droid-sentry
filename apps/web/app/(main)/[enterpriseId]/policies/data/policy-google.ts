"use server";

import { createAndroidManagementClient } from "@/lib/emm/client";
import {
  AndroidManagementPolicy,
  ListPoliciesResponse,
} from "@/app/types/policy";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

/**
 * ポリシーをDBに保存する関数
 * @param allPolicies ポリシーの配列
 * @param enterpriseId エンタープライズID
 * @param supabase Supabaseクライアント
 */
const savePoliciesToDB = async (
  policies: AndroidManagementPolicy[],
  enterpriseId: string
) => {
  const supabase = await createClient();
  const policiesList = policies
    .map((policy) => {
      const currentPolicyName = policy.name;
      if (!currentPolicyName) return;
      const policyIdentifier = currentPolicyName.split(
        `enterprises/${enterpriseId}/policies/`
      )[1];
      return {
        enterprise_id: enterpriseId,
        policy_identifier: policyIdentifier,
        policy_data: policy as Json,
        updated_at: new Date().toISOString(),
      };
    })
    .filter((policy) => policy !== undefined);

  const { error } = await supabase.from("policies").upsert(policiesList, {
    onConflict: "enterprise_id,policy_identifier",
  });

  if (error) {
    throw new Error(`Failed to save policies: ${error.message}`);
  }
};

/**
 * Googleサーバーとポリシー情報を同期する関数
 * @param enterpriseId エンタープライズID
 * @returns ポリシーの配列
 * 参考URL:https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/list
 * ライブラリ:https://googleapis.dev/nodejs/googleapis/latest/androidmanagement/classes/Resource$Enterprises$Policies.html#list
 */
export const syncPoliciesWithGoogle = async (enterpriseId: string) => {
  // 認証
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  let nextPageToken: ListPoliciesResponse["nextPageToken"] = undefined;
  const androidmanagement = await createAndroidManagementClient();
  const enterpriseName = `enterprises/${enterpriseId}`;

  do {
    const { data } = await androidmanagement.enterprises.policies
      .list({
        parent: enterpriseName,
        pageSize: 20, // 1回のAPI呼び出しで取得するポリシー数
        pageToken: nextPageToken,
      })
      .catch((error) => {
        console.error("Error Get device list:", error.message);
        throw new Error(error.message);
      });
    const { policies, nextPageToken: token } = data as ListPoliciesResponse;
    if (!policies) break;
    // １ページ毎にDBに保存
    await savePoliciesToDB(policies, enterpriseId);
    nextPageToken = token;
  } while (nextPageToken);
  revalidatePath(`/${enterpriseId}/policies`);
};
