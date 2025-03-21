"use client";

import { Button } from "@/components/ui/button";
import { Ban, EllipsisIcon, Key, Lock, RefreshCw } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { Table } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";

import { RouteParams } from "@/app/types/enterprise";
import DeviceResetAlertDialog from "../dialog/device-reset-alert-dialog";
import DeviceRemoteLookAlertDialog from "./menu/device-remote-look-alert-dialog";
import DevicePasswordResetAlertDialog from "./menu/device-password-reset-alert-dialog";
import DeviceRebootAlertDialog from "./menu/device-reboot-alert-dialog";

interface AssortCommandsMenuButtonProps<TData> {
  deviceIdentifiers: string[];
  isSelected: boolean;
  table?: Table<TData>;
}

export default function AssortCommandsMenuButton<TData>({
  deviceIdentifiers,
  isSelected,
  table,
}: AssortCommandsMenuButtonProps<TData>) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isRemoteLookDialogOpen, setIsRemoteLookDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false);
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" space-y-1 px-2" align="end">
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
          <DropdownMenuItem onClick={() => setIsResetDialogOpen(true)}>
            <Ban className="mr-4 size-4" />
            <span className="text-red-500">端末初期化</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeviceRemoteLookAlertDialog
        isRemoteLookDialogOpen={isRemoteLookDialogOpen}
        setIsRemoteLookDialogOpen={setIsRemoteLookDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifiers={deviceIdentifiers}
        table={table}
      />
      <DevicePasswordResetAlertDialog
        isPasswordResetDialogOpen={isPasswordResetDialogOpen}
        setIsPasswordResetDialogOpen={setIsPasswordResetDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifiers={deviceIdentifiers}
        table={table}
      />
      <DeviceRebootAlertDialog
        isRebootDialogOpen={isRebootDialogOpen}
        setIsRebootDialogOpen={setIsRebootDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifiers={deviceIdentifiers}
        table={table}
      />
      <DeviceResetAlertDialog
        isResetDialogOpen={isResetDialogOpen}
        setIsResetDialogOpen={setIsResetDialogOpen}
        enterpriseId={enterpriseId}
        deviceIdentifiers={deviceIdentifiers}
        table={table}
      />
    </div>
  );
}
