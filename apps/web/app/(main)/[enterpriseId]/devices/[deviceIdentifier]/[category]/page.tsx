import { TabsContent } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { CategoryProvider } from "../components/category-provider";
import { RouteParams } from "@/app/types/enterprise";
import {
  CATEGORIES,
  CATEGORY_NAMES,
  CategoryType,
} from "../../data/categories";
import HardwareInfo from "./components/hardware-info";
import SoftwareInfo from "./components/software-info";
import ApplicationReport from "./components/application-report";
import PolicyInfo from "./components/policy-info";
import NetworkInfo from "./components/network-info";
import SecurityInfo from "./components/security";
import DeviceLog from "./components/device-log";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  // URLパラメータのバリデーション
  if (!CATEGORIES.includes((await params).category as CategoryType)) {
    notFound();
  }

  const categoryName = CATEGORY_NAMES[(await params).category as CategoryType];

  return (
    <div>
      <CategoryProvider className="hidden lg:block">
        <TabsContent value="hardware">
          <HardwareInfo />
        </TabsContent>
        <TabsContent value="software">
          <SoftwareInfo />
        </TabsContent>
        <TabsContent value="application">
          <ApplicationReport />
        </TabsContent>
        <TabsContent value="policy">
          <PolicyInfo />
        </TabsContent>
        <TabsContent value="network">
          <NetworkInfo />
        </TabsContent>
        <TabsContent value="security">
          <SecurityInfo />
        </TabsContent>
        <TabsContent value="log">
          <DeviceLog />
        </TabsContent>
      </CategoryProvider>
      <div className="lg:hidden">{categoryName}</div>
    </div>
  );
}
