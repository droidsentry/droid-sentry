import { RouteParams } from "@/app/types/enterprise";
import PoliciesContent from "./components/policy-content";
import { getPolicies } from "./actions/policy";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const policies = await getPolicies({ enterpriseId });

  return (
    <div className="flex h-dvh">
      <PoliciesContent data={policies} enterpriseId={enterpriseId} />
    </div>
  );
}
