import { FormPolicy } from "@/app/types/policy";
import { defaultPolicyRequestBody } from "@/data/default-policy-request-body";

export const defaultGeneralConfig: FormPolicy = {
  policyData: defaultPolicyRequestBody,
  policyDisplayName: "", // ポリシー名
};
