import { RouteParams } from "@/app/types/enterprise";
import { getDeviceApplicationInfo } from "../actions/device";
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
