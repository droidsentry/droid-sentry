import { RouteParams } from "@/app/types/enterprise";
import AppContent from "./components/app-content";
import { getPolicyApps } from "./data/get-policy-apps";
export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const enterpriseId = (await params).enterpriseId;
  const appsData = await getPolicyApps(enterpriseId);
  return (
    <div className="flex">
      <AppContent appsData={appsData} />
    </div>
  );
}
