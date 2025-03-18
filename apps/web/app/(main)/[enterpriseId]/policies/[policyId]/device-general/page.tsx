import { RouteParams } from "@/lib/types/enterprise";
import DeviceGeneralForm from "./components/device-general-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyId = (await params).policyId;

  return (
    <ScrollArea className="h-full w-full p-2">
      <DeviceGeneralForm policyId={policyId} />
    </ScrollArea>
  );
}
