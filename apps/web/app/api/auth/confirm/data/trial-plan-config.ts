import { SubscriptionPlan } from "@/app/types/stripe";

export const trialPlanConfig: SubscriptionPlan = {
  name: "free",
  interval: "month",
  base_features: {
    device_limit: 1,
    policy_limit: 1,
    project_limit: 1,
    project_sharing: false,
    support: {
      email: false,
      phone: false,
    },
  },
  usage: {
    devices: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    policies: {
      total: 0,
      custom: 0,
    },
    projects: {
      total: 0,
      shared: 0,
    },
    pubsub: {
      monthly_messages: 0,
      monthly_data_transfer: 0,
      last_reset: "",
    },
  },
  limits: {
    pubsub: {
      max_monthly_messages: 100000,
      max_monthly_data_transfer: 1000000,
      max_message_size: 256,
    },
  },
};
