"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { deviceStates } from "../../data/data";
import CreateQrButton from "../create-qr-button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import SyncDevicesButton from "../sync-devices-button";
import DeleteSelectedDevicesButton from "../delete-selected-devices-button";
import ChangePolicyButton from "../change-policy/change-policy-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  className?: string;
  enterpriseId: string;
}

export function DataTableToolbar<TData>({
  table,
  className,
  enterpriseId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected = table.getFilteredSelectedRowModel().rows.length > 0;

  return (
    <ScrollArea>
      <div
        className={cn("flex items-center justify-between space-x-1", className)}
      >
        <div className="flex flex-1 items-center space-x-1">
          <div className="w-[52px] flex justify-center">
            <SidebarTrigger className="w-full" />
          </div>
          <div className="w-[54px] flex justify-center ">
            {isSelected && <DeleteSelectedDevicesButton table={table} />}
          </div>
          {/* <Input
            placeholder="識別 ID"
            value={
              (table.getColumn("識別 ID")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("識別 ID")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          /> */}
          {table.getColumn("ステータス") && (
            <DataTableFacetedFilter
              column={table.getColumn("ステータス")}
              title="ステータス"
              options={deviceStates}
            />
          )}
          {/* {table.getColumn("updateStatue") && (
          <DataTableFacetedFilter
            column={table.getColumn("updateStatue")}
            title="セキュリティ"
            options={updateStatuses}
          />
        )} */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              リセット
              <X className="size-5 ml-2" />
            </Button>
          )}
        </div>
        <ChangePolicyButton table={table} isSelected={isSelected} />

        {/* <DateTableColumnAllResizer table={table} /> */}
        <CreateQrButton />
        <CreateQrButton />
        <SyncDevicesButton enterpriseId={enterpriseId} />
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </ScrollArea>
  );
}
