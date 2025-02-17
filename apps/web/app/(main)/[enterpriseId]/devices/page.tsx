import { RouteParams } from "@/app/types/enterprise";
import DevicesContent from "./components/devices-content";
import { getDevicesData } from "./data/device";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const devices = await getDevicesData({ enterpriseId });
  // console.log("device", devices);
  // ３秒待つ
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="flex h-dvh space-x-1">
      <DevicesContent data={devices} enterpriseId={enterpriseId} />
    </div>
  );
}
