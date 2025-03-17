import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../actions/device";
import { DeviceSecurityTable } from "./components/device-security-table";
import DeviceSecurityPostureDetailsTable from "./components/device-security-posture-details-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;
  return (
    <div className="mx-1.5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <DeviceSecurityTable enterpriseId={enterpriseId} deviceId={deviceId} />
      <DeviceSecurityPostureDetailsTable
        enterpriseId={enterpriseId}
        deviceId={deviceId}
      />
    </div>
  );
}
