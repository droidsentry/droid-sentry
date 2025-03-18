"use client";

import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import ChangePolicyButton from "../change-policy/change-policy-button";
import DeleteSelectedDevicesButton from "../delete-selected-devices-button";
import CloseFloatingToolbarButton from "./close-floating-toolber-button";
import { Separator } from "@/components/ui/separator";
import AssortCommandsMenuButton from "./assort-commands-menu-button";
import { DeviceTableType } from "@/lib/types/device";

interface FloatingToolbarProps<TData> {
  className?: string;
  table: Table<TData>;
}

export default function FloatingToolbar<TData>({
  table,
}: FloatingToolbarProps<TData>) {
  const isSelected = table.getFilteredSelectedRowModel().rows.length > 0;
  const filteredSelectedDevices =
    table.getFilteredSelectedRowModel().rows.length;
  const devices = table
    .getSelectedRowModel()
    .rows.map((row) => row.original as DeviceTableType);

  return (
    <div
      className={cn(
        "fixed flex flex-row bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 transition-all duration-300 z-10",
        isSelected ? "translate-y-0" : "translate-y-40"
      )}
    >
      <div className="flex items-center justify-center w-max shadow-lg backdrop-blur p-2 rounded-lg bg-sidebar/10 border">
        <span className="h-8 mx-1 flex items-center">{`${filteredSelectedDevices} デバイスを選択中`}</span>
        <Separator orientation="vertical" className="h-8 mx-1" />
        <DeleteSelectedDevicesButton table={table} isSelected={isSelected} />
        <ChangePolicyButton table={table} isSelected={isSelected} />
        <AssortCommandsMenuButton
          devices={devices}
          isSelected={isSelected}
          table={table}
        />
        <Separator orientation="vertical" className="h-8 mx-1" />
        <CloseFloatingToolbarButton table={table} isSelected={isSelected} />
      </div>
    </div>
  );
}
