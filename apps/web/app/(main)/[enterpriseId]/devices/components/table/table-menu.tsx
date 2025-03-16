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
import { syncDeviceInfoFromDB } from "../../actions/device";
import DevicePasswordResetAlertDialog from "./menu/password-reset-alert-dialog";
import DeviceRebootAlertDialog from "./menu/reboot-alert-dialog";
import DeviceRemoteLookAlertDialog from "./menu/remote-look-alert-dialog";
import DeviceResetAlertDialog from "../dialog/device-reset-alert-dialog";
import DeviceStartLostModeAlertDialog from "./menu/start-lost-mood-alert-dialog";
import DeviceStopLostModeAlertDialog from "./menu/stop-lost-mood-alert-dialog";
import RemoteLookAlertDialog from "./menu/remote-look-alert-dialog";
import PasswordResetAlertDialog from "./menu/password-reset-alert-dialog";
import RebootAlertDialog from "./menu/reboot-alert-dialog";
import ResetAlertDialog from "../dialog/device-reset-alert-dialog";
import StartLostModeAlertDialog from "./menu/start-lost-mood-alert-dialog";
import StopLostModeAlertDialog from "./menu/stop-lost-mood-alert-dialog";

interface TableMenuProps {
  device: DeviceTableType;
}

export default function DeviceTableMenu({ device }: TableMenuProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isRemoteLookDialogOpen, setIsRemoteLookDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false);
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isStartLostModeDialogOpen, setIsStartLostModeDialogOpen] =
    useState(false);
  const [isStopLostModeDialogOpen, setIsStopLostModeDialogOpen] =
    useState(false);

  const currentLostMode = device.appliedState === "LOST";

  const [isLostMode, setIsLostMode] = useState(currentLostMode);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const router = useRouter();
  const { deviceId } = device;
  const handleDeviceInfo = async () => {
    if (!enterpriseId) {
      toast.error("デバイス情報は確認できません。");
      return;
    }
    router.push(`/${enterpriseId}/devices/${deviceId}/base-info`);
  };

  const handleSyncDeviceInfo = async () => {
    if (!enterpriseId) {
      toast.error("デバイス情報の取得に失敗しました。");
      return;
    }
    await syncDeviceInfoFromDB({
      deviceId,
      enterpriseId,
    })
      .then(() => {
        toast.success("デバイス情報を更新しました。");
      })
      .catch((error) => {
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
          <DropdownMenuItem onClick={() => setIsResetDialogOpen(true)}>
            <Ban className="mr-4 size-4" />
            <span className="text-red-500">端末初期化</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoteLookAlertDialog
        isRemoteLookDialogOpen={isRemoteLookDialogOpen}
        setIsRemoteLookDialogOpen={setIsRemoteLookDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
      <PasswordResetAlertDialog
        isPasswordResetDialogOpen={isPasswordResetDialogOpen}
        setIsPasswordResetDialogOpen={setIsPasswordResetDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
      <RebootAlertDialog
        isRebootDialogOpen={isRebootDialogOpen}
        setIsRebootDialogOpen={setIsRebootDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
      <ResetAlertDialog
        isResetDialogOpen={isResetDialogOpen}
        setIsResetDialogOpen={setIsResetDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
      <StartLostModeAlertDialog
        isStartLostModeDialogOpen={isStartLostModeDialogOpen}
        setIsStartLostModeDialogOpen={setIsStartLostModeDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
      <StopLostModeAlertDialog
        isStopLostModeDialogOpen={isStopLostModeDialogOpen}
        setIsStopLostModeDialogOpen={setIsStopLostModeDialogOpen}
        enterpriseId={enterpriseId}
        devices={[device]}
      />
    </div>
  );
}
