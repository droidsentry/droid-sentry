import "server-only";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * ユーザーの顧客IDを作成または取得する
 * @returns 顧客ID
 * 参考URL:https://docs.stripe.com/api/customers/create
 */
export const createOrRetrieveCustomer = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインしてください");
  }

  const customerId = user.user_metadata.stripe_customer_id;
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    // console.log("customer", customer);
    if (!customer.deleted) {
      return customerId;
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.user_metadata.username,
    metadata: {
      appUserId: user.id,
    },
  });

  // const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: { stripe_customer_id: customer.id },
  });
  if (error) {
    console.error("error", error);
    throw new Error("顧客IDの更新に失敗しました");
  }
  // console.log(data, error);

  return data?.user?.user_metadata.stripe_customer_id;
};
