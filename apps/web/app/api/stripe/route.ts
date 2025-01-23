import { NextRequest } from "next/server";
import { StripeCustomerMetadata } from "../types/stripe";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!request.body || !sig || !endpointSecret) {
    return Response.json(
      { message: "missing data" },
      {
        status: 400,
      }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      sig,
      endpointSecret
    );
  } catch (err) {
    console.log((err as Error).message);
    return Response.json(
      { message: `Webhook Error: ${(err as Error).message || String(err)}` },
      {
        status: 400,
      }
    );
  }

  let metadata: StripeCustomerMetadata | null;

  switch (event.type) {
    case "checkout.session.completed":
      // console.log("event", event);
      const object = event.data.object;
      // console.log("object", object);
      // セッションを取得: https://docs.stripe.com/api/checkout/sessions/retrieve
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        object.id,
        {
          expand: ["line_items"],
        }
      );
      console.log("sessionWithLineItems", sessionWithLineItems);
      const lineItems = sessionWithLineItems.line_items;
      const planId = lineItems?.data[0].price?.id;
      metadata = await getMetadataByStripeCustomerId(object.customer as string);

      if (metadata) {
        if (object.mode === "subscription") {
          // サブスクリプション開始時の処理
          console.log("サブスクリプション開始時の処理");
          console.log("planId", planId);
          console.log("metadata", metadata);
        } else {
          // サブスクリプション以外の決済完了時の処理
          console.log("サブスクリプション以外の決済完了時の処理");
          console.log("planId", planId);
          console.log("metadata", metadata);
        }
      }
      break;
    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;
      console.log("customerSubscriptionUpdated", customerSubscriptionUpdated);
      const prevData = event.data.previous_attributes;
      console.log("prevData", prevData);
      metadata = await getMetadataByStripeCustomerId(
        customerSubscriptionUpdated.customer as string
      );

      const newPlanId = customerSubscriptionUpdated.items.data[0].plan.id;
      console.log("newPlanId", newPlanId);

      const prevProduct = prevData?.items?.data?.[0]?.plan?.product as string;
      console.log("prevProduct", prevProduct);
      if (prevProduct) {
        // サブスクリプションを変更した際の処理
        // console.log("サブスクリプションを変更した際の処理");
        // console.log("prevProduct", prevProduct);
        // console.log("newPlanId", newPlanId);
        // console.log("metadata", metadata);
      }
      break;
    case "customer.subscription.deleted":
      // サブスクリプションが終了した際の処理

      break;
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json(
    { message: "Received webhook" },
    {
      status: 200,
    }
  );
}

const getMetadataByStripeCustomerId = async (stripeCustomerId: string) => {
  const customer = await stripe.customers.retrieve(stripeCustomerId);
  //DeletedCustomer型を除外
  if ("deleted" in customer) {
    throw new Error("Customer has been deleted");
  }
  return customer.metadata;
};
