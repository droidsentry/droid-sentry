import { Suspense } from "react";
import ManagementAppsContent from "./components/management-apps-content";
import { getApps } from "../../../../lib/actions/emm/app";
import { RouteParams } from "@/lib/types/enterprise";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const data = await getApps(enterpriseId);

  return (
    <div className="flex flex-row h-dvh p-1 border space-x-1 overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <ManagementAppsContent data={data} enterpriseId={enterpriseId} />
      </Suspense>
    </div>
  );
}
