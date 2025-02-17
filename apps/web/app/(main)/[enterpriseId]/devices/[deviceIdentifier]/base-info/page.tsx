import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../actions/device";
import { DeviceBaseInfoTable } from "./components/device-base-info-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  const deviceSource = await getHardwareInfo({
    enterpriseId,
    deviceIdentifier,
  });
  return (
    <div className="mx-1.5">
      <DeviceBaseInfoTable
        deviceSource={deviceSource}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}
