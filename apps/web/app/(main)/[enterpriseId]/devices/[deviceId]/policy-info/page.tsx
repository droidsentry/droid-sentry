import { RouteParams } from "@/app/types/enterprise";
import { getDevicePolicyInfo } from "../actions/device";
import { DevicePolicyInfoTable } from "./device-policy-info-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;
  // デバイスの情報を取得
  const deviceSource = await getDevicePolicyInfo({
    enterpriseId,
    deviceId,
  });

  return (
    <div className="mx-1.5">
      <DevicePolicyInfoTable deviceSource={deviceSource} />
    </div>
  );
}
