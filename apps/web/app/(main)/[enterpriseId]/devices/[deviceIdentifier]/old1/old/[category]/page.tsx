import { TabsContent } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { CategoryProvider } from "../../../components/category-provider";
import { RouteParams } from "@/app/types/enterprise";
import {
  CATEGORIES,
  CATEGORY_NAMES,
  CategoryType,
} from "../../../../data/categories";
import HardwareInfo from "./components/hardware-info";
import SoftwareInfo from "./components/software-info";
import ApplicationReport from "./components/application-report";
import PolicyInfo from "./components/policy-info";
import NetworkInfo from "./components/network-info";
import SecurityInfo from "./components/security";
import DeviceLog from "./components/device-log";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Undo2Icon } from "lucide-react";

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
  const enterpriseId = (await params).enterpriseId;
  const deviceIdentifier = (await params).deviceIdentifier;

  return (
    <div className="h-dvh">
      <Button variant="ghost" size="icon" className="lg:hidden" asChild>
        <Link href={`/${enterpriseId}/devices/${deviceIdentifier}`}>
          <Undo2Icon className="hover:text-primary transition-all duration-300" />
        </Link>
      </Button>
      <CategoryProvider className="hidden lg:block">
        <TabsContent value="hardware" className="flex m-1">
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
