import { RouteParams } from "@/app/types/enterprise";
import { TabsContent } from "@/components/ui/tabs";
import HardwareInfo from "../old/[category]/components/hardware-info";
import SoftwareInfo from "../old/[category]/components/software-info";
import ApplicationReport from "../old/[category]/components/application-report";
import PolicyInfo from "../old/[category]/components/policy-info";
import NetworkInfo from "../old/[category]/components/network-info";
import SecurityInfo from "../old/[category]/components/security";
import DeviceLog from "../old/[category]/components/device-log";

export default async function Page({ params }: { params: RouteParams }) {
  const { enterpriseId, deviceIdentifier, category } = await params;
  return <div className="bg-red-500 flex-1 h-full">Page/{category}</div>;
  // return (
  //   <div className="bg-red-500 h-full ">
  //     <TabsContent value="hardware" className="">
  //       <HardwareInfo />
  //     </TabsContent>
  //     <TabsContent value="software">
  //       <SoftwareInfo />
  //     </TabsContent>
  //     <TabsContent value="application">
  //       <ApplicationReport />
  //     </TabsContent>
  //     <TabsContent value="policy">
  //       <PolicyInfo />
  //     </TabsContent>
  //     <TabsContent value="network">
  //       <NetworkInfo />
  //     </TabsContent>
  //     <TabsContent value="security">
  //       <SecurityInfo />
  //     </TabsContent>
  //     <TabsContent value="log">
  //       <DeviceLog />
  //     </TabsContent>

  //     {/* <div className="lg:hidden">{category}</div> */}
  //   </div>
  // );
}
