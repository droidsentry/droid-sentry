import { RouteParams } from "@/app/types/enterprise";
import { DevicePolicyInfoTable } from "./components/device-policy-info-table";
import { getHardwareInfo } from "../actions/device";
import { getPolicyDisplayName } from "../actions/policy";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  // デバイスの情報を取得
  const deviceSource = await getHardwareInfo({
    enterpriseId,
    deviceIdentifier,
  });
  // デバイスの詳細情報からポリシー名を取得
  const policyName = deviceSource?.policyName;
  const appliedPolicyName = deviceSource?.appliedPolicyName;
  // ポリシー名の配列を作成
  const policyIdentifiers = [policyName, appliedPolicyName].filter(
    (identifier): identifier is string => identifier !== undefined
  );
  const policyDisplayNames = await getPolicyDisplayName({
    enterpriseId,
    policyIdentifiers,
  });

  // if (policyIdentifiers.length !== 0) {
  //   const data = await getPolicyDisplayName({
  //     enterpriseId,
  //     policyIdentifiers,
  //   });
  //   policyDisplayNames.policyName = data?.find(
  //     (policy) => policy.policyIdentifier === policyName
  //   );
  //   policyDisplayNames.appliedPolicyName = data?.find(
  //     (policy) => policy.policyIdentifier === appliedPolicyName
  //   );
  // }

  return (
    <div className="mx-1.5">
      <DevicePolicyInfoTable
        deviceSource={deviceSource}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
        policyDisplayNames={policyDisplayNames}
      />
    </div>
  );
}
