import { RouteParams } from "@/app/types/enterprise";
import DeviceGeneralForm from "./components/device-general-form";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const policyIdentifier = (await params).policyIdentifier;

  return (
    <div>
      <DeviceGeneralForm policyIdentifier={policyIdentifier} />
    </div>
  );
}
