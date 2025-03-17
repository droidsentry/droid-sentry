import { RouteParams } from "@/app/types/enterprise";
import AppRestriction from "./components/restriction";
import { AppRestrictionProvider } from "./components/restriction-provider";
import { getPolicyApps } from "./get-policy-apps";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const policyId = (await params).policyId;
  const policyApps = await getPolicyApps(enterpriseId);
  return (
    <div className="h-full pb-2">
      <AppRestrictionProvider>
        <AppRestriction policyApps={policyApps} policyId={policyId} />
      </AppRestrictionProvider>
    </div>
  );
}
