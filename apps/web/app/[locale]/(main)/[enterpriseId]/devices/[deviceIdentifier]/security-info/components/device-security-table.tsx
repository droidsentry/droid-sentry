"use client";

import { HardwareInfoSourceType } from "@/app/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingWithinPageSkeleton from "@/app/[locale]/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import InfoTooltip from "@/components/info-tooltip";
import { devicePosture, encryptionStatus } from "@/lib/device";
import useSWRImmutable from "swr/immutable";
import { getHardwareInfo } from "../../actions/device";

export function DeviceSecurityTable({
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
}) {
  const key = `/api/devices/${enterpriseId}/${deviceIdentifier}`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<HardwareInfoSourceType>(key, () => {
      return getHardwareInfo({ enterpriseId, deviceIdentifier });
    });
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;
  if (!data) return null;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>セキュリティ情報</CardTitle>
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
                  <span className="font-bold">画面ロックのステータス</span>
                  <InfoTooltip
                    tooltip={
                      "デバイスがPIN、または、パスワードで保護されているかどうかを表示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.isEncrypted === true ? (
                  <span>保護されています。</span>
                ) : data?.deviceSettings?.isEncrypted === false ? (
                  <span>保護されていません。</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">DPCの暗号化ステータス</span>
                  <InfoTooltip
                    tooltip={
                      "Device Policy Controllerの暗号化ステータスを表示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {encryptionStatus.find(
                  (status) =>
                    status.value === data.deviceSettings?.encryptionStatus
                )?.label ?? <span className="text-muted-foreground">-</span>}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    Google Play プロテクトのステータス
                  </span>
                  <InfoTooltip
                    tooltip={
                      "Google Play プロテクトのステータスを使用してアプリの安全性とデータプライバシーが確保されているかどうかを示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.verifyAppsEnabled === true ? (
                  <span>有効</span>
                ) : data?.deviceSettings?.verifyAppsEnabled === false ? (
                  <span>無効</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    提供元不明アプリのインストール可否
                  </span>
                  <InfoTooltip
                    tooltip={
                      "Play Store以外でアプリをインストールできるかどうかを示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.unknownSourcesEnabled === true ? (
                  <span>インストール可能</span>
                ) : data?.deviceSettings?.unknownSourcesEnabled === false ? (
                  <span>インストール不可</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">ADBの可否</span>
                  <InfoTooltip
                    tooltip={
                      "デバイスで、ADBが有効になっているかどうかを示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.adbEnabled === true ? (
                  <span>有効</span>
                ) : data?.deviceSettings?.adbEnabled === false ? (
                  <span>無効</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">ストレージの暗号化</span>
                  <InfoTooltip
                    tooltip={
                      "デバイスのストレージが暗号化されているかどうかを示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.isEncrypted === true ? (
                  <span>暗号化されています。</span>
                ) : data?.deviceSettings?.isEncrypted === false ? (
                  <span>暗号化されていません。</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    デベロッパーモードのステータス
                  </span>
                  <InfoTooltip
                    tooltip={
                      "デベロッパーモードが有効になっているかどうかを示します。"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                {data?.deviceSettings?.developmentSettingsEnabled === true ? (
                  <span>有効</span>
                ) : data?.deviceSettings?.developmentSettingsEnabled ===
                  false ? (
                  <span>無効</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    デバイスのセキュリティステータス
                  </span>
                  <InfoTooltip
                    tooltip={"デバイスのセキュリティ対策の状態を表示します。"}
                  />
                </div>
              </TableCell>
              <TableCell>
                {devicePosture.find(
                  (status) =>
                    status.value === data.securityPosture?.devicePosture
                )?.label ?? <span className="text-muted-foreground">-</span>}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
