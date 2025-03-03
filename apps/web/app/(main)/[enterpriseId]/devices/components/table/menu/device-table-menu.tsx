"use client";

import { Button } from "@/components/ui/button";
import {
  Ban,
  Download,
  EllipsisIcon,
  Key,
  Lock,
  RefreshCw,
  Smartphone,
  Vibrate,
  VibrateOffIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { DeviceTableType } from "@/app/types/device";
import { Row } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { RouteParams } from "@/app/types/enterprise";
import { syncDeviceInfoFromDB } from "../../../actions/device";
import DevicePasswordResetAlertDialog from "./device-password-reset-alert-dialog";
import DeviceRebootAlertDialog from "./device-reboot-alert-dialog";
import DeviceRemoteLookAlertDialog from "./device-remote-look-alert-dialog";
import DeviceResetAlertDialog from "./device-reset-alert-dialog";
import DeviceStartLostModeAlertDialog from "./device-start-lost-mood-alert-dialog";
import DeviceStopLostModeAlertDialog from "./device-stop-lost-mood-alert-dialog";

interface DataTableMenuProps {
  row: Row<DeviceTableType>;
}

export default function DeviceTableMenu({ row }: DataTableMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRemoteLookDialogOpen, setIsRemoteLookDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false);
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isStartLostModeDialogOpen, setIsStartLostModeDialogOpen] =
    useState(false);
  const [isStopLostModeDialogOpen, setIsStopLostModeDialogOpen] =
    useState(false);

  const currentLostMode = row.original.appliedState === "LOST";

  const [isLostMode, setIsLostMode] = useState(currentLostMode);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const deviceIdentifier = row.original.deviceIdentifier;
  const router = useRouter();

  const handleDeviceInfo = async () => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("デバイス情報は確認できません。");
      return;
    }
    router.push(`/${enterpriseId}/devices/${deviceIdentifier}/base-info`);
  };

  const handleSyncDeviceInfo = async () => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("デバイス情報の取得に失敗しました。");
      return;
    }
    await syncDeviceInfoFromDB({
      deviceIdentifier,
      enterpriseId,
    }).catch((error) => {
      toast.error("デバイス情報の取得に失敗しました。");
      console.error("デバイス情報の取得に失敗しました。", error);
    });
  };

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4 h-8" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" space-y-1 px-2" align="end">
          <DropdownMenuItem onClick={handleDeviceInfo}>
            <Smartphone className="mr-4 size-4" />
            <span>デバイス詳細</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSyncDeviceInfo}>
            <Download className="mr-4 size-4" />
            <span>デバイス情報取得</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRemoteLookDialogOpen(true)}>
            <Lock className="mr-4 size-4" />
            <span>リモートロック</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPasswordResetDialogOpen(true)}>
            <Key className="mr-4 size-4" />
            <span>パスワードリセット</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRebootDialogOpen(true)}>
            <RefreshCw className="mr-4 size-4" />
            <span>端末再起動</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => handleDeviceAction(row.original.deviceIdentifier)}
          >
            <CaptionsOff className="mr-4 size-4" />
            <span>アプリデータ削除</span>
          </DropdownMenuItem> */}
          {isLostMode ? (
            <DropdownMenuItem onClick={() => setIsStopLostModeDialogOpen(true)}>
              <VibrateOffIcon className="mr-4 size-4" />
              <span>紛失モード停止</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setIsStartLostModeDialogOpen(true)}
            >
              <Vibrate className="mr-4 size-4" />
              <span>紛失モード</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Ban className="mr-4 size-4" />
            <span className="text-red-500">端末初期化</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeviceRemoteLookAlertDialog
        isRemoteLookDialogOpen={isRemoteLookDialogOpen}
        setIsRemoteLookDialogOpen={setIsRemoteLookDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DevicePasswordResetAlertDialog
        isPasswordResetDialogOpen={isPasswordResetDialogOpen}
        setIsPasswordResetDialogOpen={setIsPasswordResetDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DeviceRebootAlertDialog
        isRebootDialogOpen={isRebootDialogOpen}
        setIsRebootDialogOpen={setIsRebootDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DeviceResetAlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DeviceStartLostModeAlertDialog
        isStartLostModeDialogOpen={isStartLostModeDialogOpen}
        setIsStartLostModeDialogOpen={setIsStartLostModeDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
      <DeviceStopLostModeAlertDialog
        isStopLostModeDialogOpen={isStopLostModeDialogOpen}
        setIsStopLostModeDialogOpen={setIsStopLostModeDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
      />
    </div>
  );
}
