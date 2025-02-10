import { RouteParams } from "@/app/types/enterprise";
import { DeviceNetworkTable } from "./components/device-network-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;

  return (
    <div className="mx-1.5">
      <DeviceNetworkTable
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}
