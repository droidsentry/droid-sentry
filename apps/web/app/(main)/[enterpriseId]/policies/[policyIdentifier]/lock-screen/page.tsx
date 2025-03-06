import { RouteParams } from "@/app/types/enterprise";
import LockScreenForm from "./components/lock-screen-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <ScrollArea className="h-full w-full p-2">
      <LockScreenForm policyIdentifier={policyIdentifier} />
    </ScrollArea>
  );
}
