// "use client";

// import { hardwareStatus } from "../../../actions/device";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { HardwareStatusType } from "@/app/types/device";

// const chartConfig = {
//   cpuUsage: {
//     label: "CPU使用率",
//     color: "hsl(var(--chart-1))",
//   },
//   cpuTemp: {
//     label: "CPU温度",
//     color: "hsl(var(--chart-2))",
//   },
//   gpuTemp: {
//     label: "GPU温度",
//     color: "hsl(var(--chart-3))",
//   },
//   skinTemp: {
//     label: "表面温度",
//     color: "hsl(var(--chart-4))",
//   },
//   batteryTemp: {
//     label: "バッテリー温度",
//     color: "hsl(var(--chart-5))",
//   },
// } as const;

// // データを整形
// const formattedData = hardwareStatus.map((status) => ({
//   time: new Date(status.createTime).toLocaleTimeString("ja-JP", {
//     hour: "2-digit",
//     minute: "2-digit",
//   }),
//   cpuUsage: (
//     (status.cpuUsages.reduce((a, b) => a + b, 0) / status.cpuUsages.length) *
//     100
//   ).toFixed(1),
//   cpuTemp: (
//     status.cpuTemperatures.reduce((a, b) => a + b, 0) /
//     status.cpuTemperatures.length
//   ).toFixed(1),
//   gpuTemp: (
//     status.gpuTemperatures.reduce((a, b) => a + b, 0) /
//     status.gpuTemperatures.length
//   ).toFixed(1),
//   skinTemp: status.skinTemperatures[0].toFixed(1),
//   batteryTemp: status.batteryTemperatures[0].toFixed(1),
// }));

// export function HardwareChart() {
//   return (
//     <div className="space-y-8">
//       <div className="rounded-lg border p-4">
//         <h3 className="text-lg font-semibold mb-4">CPU使用率</h3>
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[300px] w-full "
//         >
//           <LineChart data={formattedData}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="time" tickLine={false} axisLine={false} />
//             <YAxis tickLine={false} axisLine={false} unit="%" />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Line
//               type="monotone"
//               dataKey="cpuUsage"
//               stroke="var(--color-cpuUsage)"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </div>

//       <div className="rounded-lg border p-4">
//         <h3 className="text-lg font-semibold mb-4">温度モニター</h3>
//         <ChartContainer config={chartConfig} className="h-[300px]">
//           <LineChart data={formattedData}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="time" tickLine={false} axisLine={false} />
//             <YAxis tickLine={false} axisLine={false} unit="°C" />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Line
//               type="monotone"
//               dataKey="cpuTemp"
//               stroke="var(--color-cpuTemp)"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Line
//               type="monotone"
//               dataKey="gpuTemp"
//               stroke="var(--color-gpuTemp)"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Line
//               type="monotone"
//               dataKey="skinTemp"
//               stroke="var(--color-skinTemp)"
//               strokeWidth={2}
//               dot={false}
//             />
//             <Line
//               type="monotone"
//               dataKey="batteryTemp"
//               stroke="var(--color-batteryTemp)"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </div>
//     </div>
//   );
// }
