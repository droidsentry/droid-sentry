import HardwareInfo from "../hardware/components/hardware-info-table";
import { hardwareInfoData, hardwareStatusData } from "../hardware/page";
import SecurityInfo from "./components/security-info";

export default function Page() {
  return (
    <div className="h-ful px-1">
      <SecurityInfo />
    </div>
  );
}

const securityInfoData = {
  deviceSettings: {
    isEncrypted: true,
    encryptionStatus: "ACTIVE_PER_USER",
    verifyAppsEnabled: true,
    unknownSourcesEnabled: true,
  },
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
