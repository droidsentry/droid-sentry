import { RouteParams } from "@/app/types/enterprise";
import { getPolicyApps } from "../chrome-browser/data/get-policy-apps";
import AppRestriction from "./components/app-restriction";
import { AppRestrictionProvider } from "./components/app-restriction-provider";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const policyIdentifier = (await params).policyIdentifier;
  const policyApps = await getPolicyApps(enterpriseId);
  return (
    <div className="h-full pb-2">
      <AppRestrictionProvider>
        <AppRestriction
          policyApps={policyApps}
          policyIdentifier={policyIdentifier}
        />
      </AppRestrictionProvider>
    </div>
  );
}
