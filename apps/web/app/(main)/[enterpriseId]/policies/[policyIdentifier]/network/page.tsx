import { RouteParams } from "@/app/types/enterprise";
import AppRestriction from "./components/app-restriction";
import { getPolicyApps } from "../chrome-browser/data/get-policy-apps";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const policyIdentifier = (await params).policyIdentifier;
  const policyApps = await getPolicyApps(enterpriseId);
  return (
    <AppRestriction
      policyApps={policyApps}
      policyIdentifier={policyIdentifier}
    />
  );
}
