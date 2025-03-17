import "server-only";
import { v7 as uuidv7 } from "uuid";
import { createAdminClient } from "@/lib/supabase/admin";

export const saveDeviceInfoSubscriptions = async (enterpriseId: string) => {
  const supabase = createAdminClient();
  const { data, error: enterpriseError } = await supabase
    .from("enterprises")
    .select(
      `
      ...subscriptions(
        subscription_id
      )
    `
    )
    .eq("enterprise_id", enterpriseId)
    .single();
  if (enterpriseError) throw enterpriseError;
  if (!data) throw new Error("Enterprise not found");

  // デバイス数を集計
  const { count, error: countError } = await supabase
    .from("devices")
    .select("*", { count: "exact", head: true })
    .eq("enterprise_id", enterpriseId);
  if (countError) throw countError;
  if (count === null) throw new Error("Failed to count devices");

  // subscription.plan_configに合計のデバイスを記録
  const { subscription_id } = data;
  const { data: subscriptionsData, error: subscriptionsError } = await supabase
    .from("subscription_usages")
    .upsert(
      {
        usage_id: uuidv7(),
        subscription_id,
        total_devices: count,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "subscription_id",
      }
    )
    .select();
  if (subscriptionsError) {
    console.error(subscriptionsError);
    return;
  }
};
