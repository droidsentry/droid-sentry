import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../actions/device";
import { DeviceBaseInfoTable } from "./device-base-info-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;
  const deviceSource = await getHardwareInfo({
    enterpriseId,
    deviceId,
  });
  return (
    <div className="mx-1.5">
      <DeviceBaseInfoTable
        deviceSource={deviceSource}
        enterpriseId={enterpriseId}
        deviceId={deviceId}
      />
    </div>
  );
}
