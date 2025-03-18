"use client";

import { HardwareInfoSourceType } from "@/lib/types/device";
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

import LoadingWithinPageSkeleton from "@/lib/emm/components/loading-within-page-sleleton";
import InfoTooltip from "@/components/info-tooltip";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../../../../../lib/actions/emm/get-device-info";

export function DeviceNetworkTable({
  enterpriseId,
  deviceId,
}: {
  enterpriseId: string;
  deviceId: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceId}`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<HardwareInfoSourceType>(key, () => {
      return getHardwareInfo({ enterpriseId, deviceId });
    });
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  if (!data) return null;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>ネットワーク情報</CardTitle>
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
                  <span className="font-bold">IMEI</span>
                  <InfoTooltip
                    tooltip={
                      "GSMデバイスのIMEI番号を表示します。例 : A1000031212"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.networkInfo?.imei ? (
                  <div className="flex items-center gap-2">
                    <span>{data.networkInfo.imei}</span>
                    <CopyButton value={data.networkInfo.imei} />
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">MEID</span>
                  <InfoTooltip
                    tooltip={
                      "CDMAデバイスのMEID番号を表示します。例 : A00000292788E1"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.networkInfo?.meid ? (
                  <div className="flex items-center gap-2">
                    <span>{data.networkInfo.meid}</span>
                    <CopyButton value={data.networkInfo.meid} />
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
                  <InfoTooltip
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
                      <span className="font-bold">SIM-{index + 1}</span>
                      <InfoTooltip
                        tooltip={
                          "デバイスに搭載されているSIMの情報を表示します。Android API レベル 23 以降の管理モード「デバイスオーナー」のデバイスのみサポートしています。"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="flex flex-col gap-2">
                    {telephonyInfo.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <span>{`電話番号 : ${telephonyInfo.phoneNumber}`}</span>
                        <CopyButton value={telephonyInfo.phoneNumber} />
                      </div>
                    )}
                    {telephonyInfo.carrierName && (
                      <div className="flex items-center gap-2">
                        <span>{`キャリア : ${telephonyInfo.carrierName}`}</span>
                      </div>
                    )}
                    {telephonyInfo.iccId && (
                      <div className="flex items-center gap-2">
                        <span>{`ICCID : ${telephonyInfo.iccId}`}</span>
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
                    <InfoTooltip
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
