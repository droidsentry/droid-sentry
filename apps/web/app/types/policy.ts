import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import { formPolicySchema, policySchema } from "../schemas/policy";
import { getPolicyApps } from "../(main)/[enterpriseId]/policies/[policyId]/application/get-policy-apps";
import { getPolicyList } from "../(main)/[enterpriseId]/devices/actions/policy";
import { getPolicies } from "../(main)/[enterpriseId]/policies/actions/policy";

export type AndroidManagementPolicy = androidmanagement_v1.Schema$Policy;
export type ApplicationPolicy = androidmanagement_v1.Schema$ApplicationPolicy;
export type DisplaySettingsPolicy = androidmanagement_v1.Schema$DisplaySettings;
export type ScreenBrightnessSettings =
  androidmanagement_v1.Schema$ScreenBrightnessSettings;
export type ScreenTimeoutSettings =
  androidmanagement_v1.Schema$ScreenTimeoutSettings;
export type PasswordRequirements =
  androidmanagement_v1.Schema$PasswordRequirements;
export type DeviceConnectivityManagement =
  androidmanagement_v1.Schema$DeviceConnectivityManagement;

export type ListPoliciesResponse =
  androidmanagement_v1.Schema$ListPoliciesResponse;

export type PolicyTableType = Awaited<ReturnType<typeof getPolicies>>[number];

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
// export type PolicyApp1 = Awaited<ReturnType<typeof getPolicyApps>>;

export type PolicyList = Awaited<ReturnType<typeof getPolicyList>>[number];
