import "server-only";

import { currentUser } from "@/app/data/auth";
// import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

/**
 * ユーザーの顧客IDを作成または取得する
 * @returns 顧客ID
 * 参考URL:https://docs.stripe.com/api/customers/create
 */
export const createOrRetrieveCustomer = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("ログインしてください");
  }

  const customerId = user.user_metadata.stripe_customer_id;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    console.log("customer", customer);
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: { stripe_customer_id: customer.id },
  });
  console.log(data, error);

  return data?.user?.user_metadata.stripe_customer_id;
};
