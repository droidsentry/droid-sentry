import { RouteParams } from "@/app/types/enterprise";
import NetworkForm from "./components/network-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WifiSsidTable } from "./components/wifi-ssid-table";
import WifiTableForm from "./components/wifi-table-form";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <ScrollArea className="h-full w-full p-2">
      <WifiSsidTable />
      {/* <NetworkForm policyIdentifier={policyIdentifier} /> */}
      {/* <WifiTableForm policyIdentifier={policyIdentifier} /> */}
    </ScrollArea>
  );
}
