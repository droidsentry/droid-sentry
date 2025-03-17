import { RouteParams } from "@/app/types/enterprise";
import { HardwareBatteryTemperatureChart } from "./components/charts/hardware-battery-temperature-chart";
import { HardwareCpuUsagesChart } from "./components/charts/hardware-cpu-chart";
import { HardwareCpuTemperatureChart } from "./components/charts/hardware-cpu-temperature-chart";
import { HardwareGpuTemperatureChart } from "./components/charts/hardware-gpu-temperature-chart";
import { HardwareSkinTemperatureChart } from "./components/charts/hardware-skin-temperature-chart";
import { HardwareTemperaturesAverageChart } from "./components/charts/hardware-temperatures-average-chart";
import DisplaysTable from "./components/displays-table";
import HardwareInfoTable from "./components/hardware-info-table";
import { getHardwareInfo } from "../actions/device";
import { getHardwareStatus } from "./hardware-status";
import { HardwareFanSpeedsChart } from "./components/charts/hardware-fan-speeds-chart";

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceId } = await params;
  const deviceSource = await getHardwareInfo({
    enterpriseId,
    deviceId,
  });
  const hardwareStatusSource = await getHardwareStatus({
    enterpriseId,
    deviceId,
  });
  return (
    <div className="mx-1.5 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="flex flex-col gap-2">
        <HardwareInfoTable deviceSource={deviceSource} />
        <DisplaysTable deviceSource={deviceSource} />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <HardwareTemperaturesAverageChart
          hardwareStatusSource={hardwareStatusSource}
        />
        <HardwareCpuUsagesChart hardwareStatusSource={hardwareStatusSource} />
        <HardwareCpuTemperatureChart
          hardwareStatusSource={hardwareStatusSource}
        />
        <HardwareGpuTemperatureChart
          hardwareStatusSource={hardwareStatusSource}
        />
        <HardwareSkinTemperatureChart
          hardwareStatusSource={hardwareStatusSource}
        />
        <HardwareBatteryTemperatureChart
          hardwareStatusSource={hardwareStatusSource}
        />
        <HardwareFanSpeedsChart hardwareStatusSource={hardwareStatusSource} />
      </div>
    </div>
  );
}
