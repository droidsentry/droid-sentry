import { RouteParams } from "@/lib/types/enterprise";
import { getDeviceApplicationInfo } from "../../../../../../lib/actions/emm/get-device-info";
import { DeviceApplicationInfoTable } from "./device-application-info-table";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;
  // デバイスの情報を取得
  const deviceApplicationSource = await getDeviceApplicationInfo({
    enterpriseId,
    deviceId,
  });
  console.log("deviceApplicationSource", deviceApplicationSource);

  return (
    <div className="mx-1.5">
      <DeviceApplicationInfoTable
        deviceApplicationSource={deviceApplicationSource}
      />
    </div>
  );
}
