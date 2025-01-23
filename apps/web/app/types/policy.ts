import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import { getPolicyApps } from "../(main)/[enterpriseId]/policies/[policyIdentifier]/application/data/get-policy-apps";
import {
  formPolicySchema,
  policySchema,
  policyTableSchema,
} from "../schema/policy";

export type AndroidManagementPolicy = androidmanagement_v1.Schema$Policy;
export type ListPoliciesResponse =
  androidmanagement_v1.Schema$ListPoliciesResponse;

export type PolicyTableType = z.infer<typeof policyTableSchema>;

export type Policy = z.infer<typeof policySchema>;
export type FormPolicy = z.infer<typeof formPolicySchema>;

export type PolicyApps = androidmanagement_v1.Schema$ApplicationPolicy;
export type Apps = {
  appId: string;
  enterpriseId: string;
  packageName: string;
  title: string;
  iconUrl: string;
  appType: string;
  installType?: string | null; //"BLOCKED" | "REQUIRED_FOR_SETUP";
  disabled?: boolean | null;
  updatedAt: string;
};

export type PolicyApp = Awaited<ReturnType<typeof getPolicyApps>>[number];
