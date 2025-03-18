import "server-only";

import { createOrRetrieveCustomer } from "@/data/stripe/get-customer";
import { getListPrices } from "@/data/stripe/get-prices";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { trialPlanConfig } from "./trial-plan-config";

/**
 * トライアルサブスクリプションの作成
 * @param userId ユーザーID
 * 参考URL https://stripe.com/docs/api/subscriptions/create
 */
export const createTrialSubscription = async (userId: string) => {
  const lookupKeys = ["license"]; // 価格キー
  const prices = await getListPrices(lookupKeys);
  const quantity = 1; // 1IDを使用可能にする
  const customer = await createOrRetrieveCustomer();
  const trial_period_days = 30; // 30日間の試用期間

  // デフォルトの支払い方法を保存する
  const trialSubscription = await stripe.subscriptions
    .create({
      customer,
      items: [{ price: prices.data[0].id, quantity }],
      trial_period_days,
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      trial_settings: {
        end_behavior: { missing_payment_method: "cancel" }, // 試用期間終了時に支払い方法がない場合はサブスクリプションをキャンセルする
      },
    })
    .catch((error) => {
      console.log("error", error);
      throw new Error("サブスクリプションの作成に失敗しました");
    });

  const supabase = await createClient();
  const currentISODate = new Date().toISOString();
  const planConfig = trialPlanConfig;
  const { error } = await supabase.from("subscriptions").insert({
    owner_id: userId,
    stripe_subscription_id: trialSubscription.id,
    status: trialSubscription.status,
    plan_config: planConfig,
    updated_at: currentISODate,
  });
  if (error) {
    console.error("error", error);
    throw new Error("サブスクリプションの作成に失敗しました");
  }
};
