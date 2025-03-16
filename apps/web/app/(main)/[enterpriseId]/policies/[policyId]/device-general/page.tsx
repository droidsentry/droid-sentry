import { RouteParams } from "@/app/types/enterprise";
import DeviceGeneralForm from "./components/device-general-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <ScrollArea className="h-full w-full p-2">
      <DeviceGeneralForm policyIdentifier={policyIdentifier} />
    </ScrollArea>
  );
}
