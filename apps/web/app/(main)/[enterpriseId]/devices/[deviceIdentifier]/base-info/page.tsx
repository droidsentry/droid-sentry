import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../hardware/data/hardware";
import { DeviceBaseInfoTable } from "./components/table/device-base-info-table";
import HardwareInfoTable from "../hardware/components/hardware-info-table";

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
    <div className="mx-2 space-y-2 ">
      <DeviceBaseInfoTable deviceSource={deviceSource} />
    </div>
  );
}
