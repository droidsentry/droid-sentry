"use server";

import { createClient } from "@/lib/supabase/server";

export const getPolicyDisplayName = async ({
  enterpriseId,
  policyIdentifiers,
}: {
  enterpriseId: string;
  policyIdentifiers: string[];
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
      policyIdentifier:policy_identifier,
      policyDisplayName:policy_display_name
      `
    )
    .eq("enterprise_id", enterpriseId)
    .in("policy_identifier", policyIdentifiers);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};
