import { RouteParams } from "@/app/types/enterprise";
import { DeviceSoftwareTable } from "./device-software-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;

  return (
    <div className="mx-1.5">
      <DeviceSoftwareTable enterpriseId={enterpriseId} deviceId={deviceId} />
    </div>
  );
}
