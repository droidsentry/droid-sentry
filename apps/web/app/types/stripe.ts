import Stripe from "stripe";
import {
  SubscriptionDeviceSchema,
  SubscriptionPlanSchema,
} from "../schema/stripe";
import { z } from "zod";

export type Price = {
  name: string;
  amount: number;
  lookupKey: string | null;
  interval: Stripe.Price.Recurring.Interval | undefined;
  intervalCount: number | undefined;
};

export type SubscriptionDevice = z.infer<typeof SubscriptionDeviceSchema>;

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;
