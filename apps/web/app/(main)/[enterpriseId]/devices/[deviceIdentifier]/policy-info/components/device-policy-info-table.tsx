"use client";

import {
  HardwareInfoSourceType,
  PolicyDisplayNameType,
} from "@/app/types/device";
import CopyButton from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingWithinPageSkeleton from "@/app/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import InformationTooltip from "@/components/information-tooltip";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../actions/device";

export function DevicePolicyInfoTable({
  deviceSource,
  enterpriseId,
  deviceIdentifier,
  policyDisplayNames,
}: {
  deviceSource: HardwareInfoSourceType;
  enterpriseId: string;
  deviceIdentifier: string;
  policyDisplayNames: PolicyDisplayNameType;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceIdentifier}`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<HardwareInfoSourceType>(
      key,
      () => {
        return getHardwareInfo({ enterpriseId, deviceIdentifier });
      },
      {
        fallbackData: deviceSource,
      }
    );
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  if (!data) return null;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>ポリシー情報</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">項目</TableHead>
              <TableHead className="w-1/2">値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">適用ポリシー</span>
                  <InformationTooltip
                    tooltip={"適用がリクエストされているポリシーを表示します。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {data.policyName &&
                data.policyName.includes("polices/") &&
                policyDisplayNames ? (
                  <div className="flex items-center gap-2">
                    {policyDisplayNames.find(
                      (policy) =>
                        policy.policyIdentifier ===
                        data.policyName?.split("polices/")[1]
                    )?.policyDisplayName
                      ? policyDisplayNames.find(
                          (policy) =>
                            policy.policyIdentifier ===
                            data.policyName?.split("polices/")[1]
                        )?.policyDisplayName
                      : data.policyName}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">適用済みポリシー</span>
                  <InformationTooltip
                    tooltip={"現在、適用されているポリシーを表示します。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.appliedPolicyName ? (
                  <div className="flex items-center gap-2">
                    <span>{data.appliedPolicyName}</span>
                    <CopyButton value={data.appliedPolicyName} />
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">MACアドレス</span>
                  <InformationTooltip
                    tooltip={
                      "Wi-FiのMACアドレスを表示します。例 : 7c:11:11:11:11:11"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.networkInfo?.wifiMacAddress ? (
                  <div className="flex items-center gap-2">
                    <span>{data.networkInfo.wifiMacAddress}</span>
                    <CopyButton value={data.networkInfo.wifiMacAddress} />
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            {data.networkInfo?.telephonyInfos ? (
              data.networkInfo?.telephonyInfos.map((telephonyInfo, index) => (
                <TableRow key={`telephony-info-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">SIM{index + 1}</span>
                      <InformationTooltip
                        tooltip={
                          "デバイスに搭載されているSIMの情報を表示します。Android API レベル 23 以降の管理モード「デバイスオーナー」のデバイスのみサポートしています。"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {telephonyInfo.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <span>{telephonyInfo.phoneNumber}</span>
                        <CopyButton value={telephonyInfo.phoneNumber} />
                      </div>
                    )}
                    {telephonyInfo.carrierName && (
                      <div className="flex items-center gap-2">
                        <span>{telephonyInfo.carrierName}</span>
                        <CopyButton value={telephonyInfo.carrierName} />
                      </div>
                    )}
                    {telephonyInfo.iccId && (
                      <div className="flex items-center gap-2">
                        <span>{telephonyInfo.iccId}</span>
                        <CopyButton value={telephonyInfo.iccId} />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">SIM</span>
                    <InformationTooltip
                      tooltip={
                        "デバイスに搭載されているSIMの情報を表示します。Android API レベル 23 以降の管理モード「デバイスオーナー」のデバイスのみサポートしています。"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">-</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
