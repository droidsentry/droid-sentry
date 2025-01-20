"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * ポリシーを取得
 * @param enterpriseName
 * @returns policies
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
      enterpriseId:enterprise_id,
      policyIdentifier:policy_identifier,
      policyDisplayName:policy_display_name,
      createdAt:created_at,
      updatedAt:updated_at,
      version:policy_data->>version
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
