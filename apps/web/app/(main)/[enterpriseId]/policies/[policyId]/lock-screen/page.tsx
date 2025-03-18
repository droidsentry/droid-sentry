import { RouteParams } from "@/lib/types/enterprise";
import LockScreenForm from "./components/lock-screen-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyId = (await params).policyId;

  return (
    <ScrollArea className="h-full w-full p-2">
      <LockScreenForm policyId={policyId} />
    </ScrollArea>
  );
}
