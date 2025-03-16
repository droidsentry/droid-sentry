import { RouteParams } from "@/app/types/enterprise";
import NetworkForm from "./components/network-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WifiSsidTable } from "./components/wifi-ssid-table";
import WifiTableForm from "./components/wifi-table-form";

import { getNetworkConfigurations } from "./actions/network";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;
  const enterpriseId = (await params).enterpriseId;
  const networkConfigurations = await getNetworkConfigurations(enterpriseId);

  return (
    <ScrollArea className="h-full w-full p-2">
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        <NetworkForm policyIdentifier={policyIdentifier} />
        <WifiSsidTable
          enterpriseId={enterpriseId}
          policyIdentifier={policyIdentifier}
          networkConfigurations={networkConfigurations}
        />
      </div>
    </ScrollArea>
  );
}
