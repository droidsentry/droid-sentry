import { RouteParams } from "@/lib/types/enterprise";
import NetworkForm from "./components/network-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WifiSsidTable } from "./components/wifi-ssid-table";
import WifiTableForm from "./components/wifi-table-form";

import { getNetworkConfigurations } from "./actions";
import { checkServiceLimit } from "@/lib/service";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyId = (await params).policyId;
  const enterpriseId = (await params).enterpriseId;
  const networkConfigurations = await getNetworkConfigurations(enterpriseId);
  const isMaxSsidsPerUser = await checkServiceLimit(
    enterpriseId,
    "max_ssids_per_user"
  );

  return (
    <ScrollArea className="h-full w-full p-2">
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        <NetworkForm policyId={policyId} />
        <WifiSsidTable
          enterpriseId={enterpriseId}
          policyId={policyId}
          networkConfigurations={networkConfigurations}
          isMaxSsidsPerUser={isMaxSsidsPerUser}
        />
      </div>
    </ScrollArea>
  );
}
