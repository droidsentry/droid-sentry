import { RouteParams } from "@/app/types/enterprise";
import LockScreenForm from "./components/lock-screen-form";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <div>
      <LockScreenForm policyIdentifier={policyIdentifier} />
    </div>
  );
}
