import { RouteParams } from "@/app/types/enterprise";
import DevicesContent from "./components/devices-content";
import { getDevicesData } from "./actions/device";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const devices = await getDevicesData({ enterpriseId });

  return (
    <div className="flex h-dvh space-x-1">
      <DevicesContent data={devices} enterpriseId={enterpriseId} />
    </div>
  );
}
