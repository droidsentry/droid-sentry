import { RouteParams } from "@/app/types/enterprise";
import { getHardwareInfo } from "../actions/device";
import { DeviceSoftwareTable } from "./components/device-software-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier } = await params;
  // const deviceSource = await getHardwareInfo({
  //   enterpriseId,
  //   deviceIdentifier,
  // });
  return (
    <div className="mx-1.5 bg-fuchsia-300 flex h-full w-full">
      {/* <DeviceSoftwareTable
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      /> */}
    </div>
  );
}
