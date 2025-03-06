import { RouteParams } from "@/app/types/enterprise";
import NetworkForm from "./components/network-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <ScrollArea className="h-full w-full p-2">
      <NetworkForm policyIdentifier={policyIdentifier} />
    </ScrollArea>
  );
}
