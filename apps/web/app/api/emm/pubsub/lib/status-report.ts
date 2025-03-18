import { getDeviceDisplayName } from "@/lib/emm/device";
import { AndroidManagementDevice } from "@/lib/types/device";

export const createStatusReportDescription = async ({
  enterpriseId,
  deviceId,
  deviceData,
}: {
  enterpriseId: string;
  deviceId: string;
  deviceData: AndroidManagementDevice;
}) => {
  const deviceDisplayName =
    (await getDeviceDisplayName(enterpriseId, deviceId)) ?? "端末名未設定";
  const deviceModel = deviceData.hardwareInfo?.model;
  const appliedState = deviceData.appliedState;
  const policyCompliance = deviceData.policyCompliant ? "◯" : "×";
  const nonComplianceDetails = deviceData.nonComplianceDetails
    ?.map((nonComplianceDetail) => {
      return `${nonComplianceDetail.nonComplianceReason}`;
    })
    .join("\n");

  const description = `
      デバイスID: ${deviceId} のステータスレポートを受信しました
      端末名：${deviceDisplayName}
      デバイスモデル：${deviceModel}
      ステータス：${appliedState}
      ポリシー準拠：${policyCompliance}
      ${nonComplianceDetails ? `非準拠詳細：${nonComplianceDetails}` : ""}
      `;
  return description;
};
