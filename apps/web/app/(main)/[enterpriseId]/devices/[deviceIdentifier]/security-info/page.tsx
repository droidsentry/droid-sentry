import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../actions/device";
import { DeviceSecurityTable } from "./components/device-security-table";
import DeviceSecurityPostureDetailsTable from "./components/device-security-posture-details-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  return (
    <div className="mx-1.5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <DeviceSecurityTable
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DeviceSecurityPostureDetailsTable
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}

const securityInfoData = {
  // deviceSettings: {
  //   isEncrypted: true,
  //   encryptionStatus: "ACTIVE_PER_USER",
  //   verifyAppsEnabled: true,
  //   unknownSourcesEnabled: true,
  // },
  securityPosture: {
    devicePosture: "POTENTIALLY_COMPROMISED",
    postureDetails: [
      {
        advice: [
          {
            defaultMessage: "The user should lock their device's bootloader.",
          },
        ],
        securityRisk: "UNKNOWN_OS",
      },
      {
        securityRisk: "HARDWARE_BACKED_EVALUATION_FAILED",
      },
    ],
  },
  appliedPasswordPolicies: [],
  commonCriteriaModeInfo: {
    commonCriteriaModeStatus: "COMMON_CRITERIA_MODE_DISABLED",
    policySignatureVerificationStatus: "POLICY_SIGNATURE_VERIFICATION_DISABLED",
  },
};
