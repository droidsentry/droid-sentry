import { RouteParams } from "@/app/types/enterprise";
import DeviceDetailInfoTopBar from "./components/device-detail-info-top-bar";
import MableDeviceDetailInfoTopBar from "./components/mable-device-detail-info-top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  return (
    <div className="flex flex-col h-full ">
      <div className="flex">
        <DeviceDetailInfoTopBar
          enterpriseId={enterpriseId}
          deviceIdentifier={deviceIdentifier}
          className="hidden lg:block"
        />
        <MableDeviceDetailInfoTopBar
          enterpriseId={enterpriseId}
          deviceIdentifier={deviceIdentifier}
          className="lg:hidden"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="relative h-full">
          <div className="absolute size-full">
            <ScrollArea className="size-full">{children}</ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
