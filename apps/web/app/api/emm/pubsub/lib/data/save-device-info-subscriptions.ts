import "server-only";
import { v7 as uuidv7 } from "uuid";
import { createAdminClient } from "@/lib/supabase/admin";

export const saveDeviceInfoSubscriptions = async (enterpriseId: string) => {
  const supabase = createAdminClient();
  // まず owner_id を取得
  const { data: enterpriseData, error: enterpriseError } = await supabase
    .from("enterprises")
    .select(
      `
      owner_id,
      ...subscriptions(
        subscription_id
      )
    `
    )
    .eq("enterprise_id", enterpriseId)
    .single();

  console.log("saveDeviceInfoSubscriptions", enterpriseData);

  if (enterpriseError) throw enterpriseError;
  if (!enterpriseData) throw new Error("Enterprise not found");

  // デバイス数を集計
  const { count, error: countError } = await supabase
    .from("devices")
    .select("*", { count: "exact", head: true })
    .eq("enterprise_id", enterpriseId);

  console.log("saveDeviceInfoSubscriptions", count);

  if (countError) throw countError;
  if (count === null) throw new Error("Failed to count devices");

  // subscription.plan_configに合計のデバイスを記録
  const { data: subscriptionsData, error: subscriptionsError } = await supabase
    .from("subscription_usages")
    .upsert(
      {
        usage_id: uuidv7(),
        subscription_id: enterpriseData.subscription_id,
        total_devices: count,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "subscription_id",
      }
    )
    .select();

  console.log("saveDeviceInfoSubscriptions", subscriptionsData);

  if (subscriptionsError) {
    console.error(subscriptionsError);
    return;
  }
};
