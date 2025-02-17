import { RouteParams } from "@/app/types/enterprise";
import { DeviceSoftwareTable } from "./components/device-software-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;

  return (
    <div className="mx-1.5">
      <DeviceSoftwareTable
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}
