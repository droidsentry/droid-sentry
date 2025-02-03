import { RouteParams } from "@/app/types/enterprise";
import CategoryTopBar from "./components/category-top-bar";
import MableDeviceInfoTopBar from "./components/mable-device-info-top-bar";
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
        <CategoryTopBar
          enterpriseId={enterpriseId}
          deviceIdentifier={deviceIdentifier}
          className="hidden lg:block"
        />
        <MableDeviceInfoTopBar
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
