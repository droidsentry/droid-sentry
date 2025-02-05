"use client";

import { HardwareInfoSourceType } from "@/app/types/device";
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

import InformationTooltip from "@/components/information-tooltip";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { deviceUpdateStatus } from "@/lib/device";
import useSWR from "swr";
import { getHardwareInfo } from "../../actions/device";
import LoadingSkeleton from "@/app/(main)/[enterpriseId]/components/loading";

export function DeviceSecurityTable({
  deviceSource,
  enterpriseId,
  deviceIdentifier,
}: {
  deviceSource: HardwareInfoSourceType;
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceIdentifier}`;
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<HardwareInfoSourceType>(
      key,
      () => {
        return getHardwareInfo({ enterpriseId, deviceIdentifier });
      },
      {
        fallbackData: deviceSource,
        revalidateOnFocus: false, // タブ移動しても関数を実行しない
        // dedupingInterval: 3600000, // 3600000ms = 1時間は関数を実行しない。キャッシュされたでデータを返す。
      }
    );
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>ローディング中...</div>;
  // if (isLoading) return <LoadingSkeleton />;
  if (isValidating) return <div>更新中...</div>;
  if (!data) return null;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>ソフトウェア情報</CardTitle>
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
                  <span className="font-bold">API レベル</span>
                  <InformationTooltip
                    tooltip={"デバイスで実行されているAndroid OSのAPIレベル。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.apiLevel ? (
                  <span>{data.apiLevel}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">OSバージョン</span>
                  <InformationTooltip
                    tooltip={
                      "ユーザーがデバイスのシステム情報から確認できるOSバージョン。例:6.0.1"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidVersion ? (
                  <span>{data.softwareInfo.androidVersion}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">OSビルド日時</span>
                  <InformationTooltip
                    tooltip={
                      "OSがビルドされた日時。RFC3339 UTC「Zulu」形式で取得されたタイムスタンプを日本時間に変換し表示しています。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidBuildTime ? (
                  <div className="flex items-center gap-2">
                    <span>
                      {formatToJapaneseDateTime(
                        data.softwareInfo.androidBuildTime
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    システムアップデートのステータス
                  </span>
                  <InformationTooltip
                    tooltip={
                      "デバイスで保留中になっているシステムアップデートのステータス。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {deviceUpdateStatus.find(
                  (status) =>
                    status.value ===
                    data.softwareInfo?.systemUpdateInfo?.updateStatus
                )?.label ?? <span className="text-muted-foreground">-</span>}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    システムアップデートの可能日時
                  </span>
                  <InformationTooltip
                    tooltip={
                      "アップデートが最初に利用可能になった日時。RFC3339 UTC「Zulu」形式で取得されたタイムスタンプを日本時間に変換し表示しています。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.systemUpdateInfo?.updateReceivedTime &&
                data.softwareInfo.systemUpdateInfo.updateReceivedTime !==
                  "0" ? (
                  <span>
                    {formatToJapaneseDateTime(
                      data.softwareInfo.systemUpdateInfo.updateReceivedTime
                    )}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    システム ブードローダーのバージョン
                  </span>
                  <InformationTooltip
                    tooltip={
                      "Android OSのブートローダーのバージョンを表示。例:0.6.7"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.bootloaderVersion ? (
                  <span>
                    {data.softwareInfo.bootloaderVersion === "unknown"
                      ? "不明"
                      : data.softwareInfo.bootloaderVersion}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Android ビルドID</span>
                  <InformationTooltip
                    tooltip={
                      "ユーザーがデバイスのシステム情報から確認できるビルドIDを表示します。例:SP1A.210812.016.C1"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidBuildNumber ? (
                  <span>{data.softwareInfo.androidBuildNumber}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">セキュリティパッチレベル</span>
                  <InformationTooltip
                    tooltip={
                      "ユーザーがデバイスのシステム情報から確認できるセキュリティパッチレベルを表示します。例:2021-10-05"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.securityPatchLevel ? (
                  <span>{data.softwareInfo.securityPatchLevel}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">カーネルバージョン</span>
                  <InformationTooltip
                    tooltip={"例:4.9.270-g862f51bac900-ab7613625"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.deviceKernelVersion ? (
                  <span>{data.softwareInfo.deviceKernelVersion}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">言語設定</span>
                  <InformationTooltip
                    tooltip={
                      "デバイスにメインで使用されている言語を表示します。例:ja-JP"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.primaryLanguageCode ? (
                  <span>{data.softwareInfo.primaryLanguageCode}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">ビルド署名</span>
                  <InformationTooltip
                    tooltip={
                      "システムのビルド署名に使用されているSHA-256ハッシュ値。システムピルドが変更されていないことを確認するために使用されます。例:6ea2839477b835a5e5fa5d3a63ebe59129120103973e7f94f513b63cb40148c6"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.deviceBuildSignature ? (
                  <div className="flex items-center gap-2">
                    <span>{data.softwareInfo.deviceBuildSignature}</span>
                    <CopyButton
                      value={data.softwareInfo.deviceBuildSignature}
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">DPC バージョンコード</span>
                  <InformationTooltip
                    tooltip={
                      "Android Device Policyのバージョンコードを表示します。例:10284460"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidDevicePolicyVersionCode ? (
                  <span>
                    {data.softwareInfo.androidDevicePolicyVersionCode}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">DPC バージョン</span>
                  <InformationTooltip
                    tooltip={
                      "Android Device Policyのバージョンを表示します。例:124.90.1"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.softwareInfo?.androidDevicePolicyVersionName ? (
                  <span>
                    {data.softwareInfo.androidDevicePolicyVersionName}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
