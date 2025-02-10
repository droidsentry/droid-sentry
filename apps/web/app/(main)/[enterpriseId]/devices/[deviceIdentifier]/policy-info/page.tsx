import { RouteParams } from "@/app/types/enterprise";
import { getDevicePolicyInfo } from "../actions/device";
import { DevicePolicyInfoTable } from "./components/device-policy-info-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  // デバイスの情報を取得
  const deviceSource = await getDevicePolicyInfo({
    enterpriseId,
    deviceIdentifier,
  });

  return (
    <div className="mx-1.5">
      <DevicePolicyInfoTable
        deviceSource={deviceSource}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}
