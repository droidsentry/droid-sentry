import { RouteParams } from "@/app/types/enterprise";
import AppRestriction from "./components/app-restriction";
import { getPolicyApps } from "../chrome-browser/data/get-policy-apps";
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
    <AppRestrictionProvider>
      <AppRestriction
        policyApps={policyApps}
        policyIdentifier={policyIdentifier}
      />
    </AppRestrictionProvider>
  );
}
