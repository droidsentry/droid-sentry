import { RouteParams } from "@/app/types/enterprise";
import { DeviceNetworkTable } from "./device-network-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;

  return (
    <div className="mx-1.5">
      <DeviceNetworkTable enterpriseId={enterpriseId} deviceId={deviceId} />
    </div>
  );
}
