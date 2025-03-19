import { RouteParams } from "@/lib/types/enterprise";
import DevicesContent from "./components/devices-content";
import { getDevicesData } from "./actions/device";
import { checkServiceLimit } from "@/lib/service";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const devices = await getDevicesData({ enterpriseId });
  const isMaxDevicesKittingPerUser = await checkServiceLimit(
    enterpriseId,
    "max_devices_kitting_per_user"
  );

  return (
    <div className="flex h-dvh space-x-1">
      <DevicesContent
        data={devices}
        enterpriseId={enterpriseId}
        isMaxDevicesKittingPerUser={isMaxDevicesKittingPerUser}
      />
    </div>
  );
}
