"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Control, useFormContext } from "react-hook-form";
import { FormPolicy } from "@/app/types/policy";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SecurityType = "None" | "WEP-PSK" | "WPA-PSK" | "WPA2-PSK" | "WPA3-PSK";
type MACAddressRandomizationMode = "Hardware" | "Software" | "None";

interface WiFiConfig {
  SSID: string;
  Security: SecurityType;
  Passphrase?: string;
  AutoConnect?: boolean;
  MACAddressRandomizationMode?: MACAddressRandomizationMode;
}

export interface NetworkConfiguration {
  GUID: string;
  Name: string;
  Type: "WiFi";
  WiFi: WiFiConfig;
}

export type NetworkConfigurations = NetworkConfiguration[];

const wifiSsidData: NetworkConfigurations = [
  {
    GUID: "a",
    Name: "Example A",
    Type: "WiFi",
    WiFi: {
      SSID: "Example A",
      Security: "None",
      AutoConnect: true,
    },
  },
  {
    GUID: "b",
    Name: "Example B",
    Type: "WiFi",
    WiFi: {
      SSID: "Example B",
      Security: "WEP-PSK",
      Passphrase: "1234567890",
    },
  },
  {
    GUID: "c",
    Name: "20220228se2",
    Type: "WiFi",
    WiFi: {
      SSID: "20220228se2",
      Security: "WPA-PSK",
      Passphrase: "4321098765",
    },
  },
  {
    GUID: "networkA",
    Name: "networkA",
    Type: "WiFi",
    WiFi: {
      SSID: "networkA",
      Security: "WPA-PSK",
      Passphrase: "pwd1234567",
      MACAddressRandomizationMode: "Hardware",
    },
  },
];

export const wifiSsidColumns: ColumnDef<NetworkConfiguration>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded-full"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded-full"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "ssid",
    accessorFn: (row) => row.WiFi.SSID,
    header: "SSID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("ssid")}</div>,
  },
  {
    id: "security",
    accessorFn: (row) => row.WiFi.Security,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          セキュリティ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("security")}</div>
    ),
  },
];

export const NetworkConfigSwitch = React.memo(
  ({
    control,
    rowData,
  }: {
    control: Control<FormPolicy>;
    rowData: NetworkConfiguration;
  }) => (
    <FormField
      control={control}
      name={`policyData.openNetworkConfiguration.NetworkConfigurations`}
      render={({ field }) => {
        const isEnabled = (field.value || []).some(
          (config: NetworkConfiguration) => config.GUID === rowData.GUID
        );

        return (
          <FormControl>
            <Switch
              checked={isEnabled}
              onCheckedChange={(checked) => {
                const currentConfigs = field.value || [];
                const newConfigs = checked
                  ? [...currentConfigs, rowData]
                  : currentConfigs.filter(
                      (config: NetworkConfiguration) =>
                        config.GUID !== rowData.GUID
                    );

                field.onChange(newConfigs);
              }}
            />
          </FormControl>
        );
      }}
    />
  )
);

// 削除用のアクションコンポーネントを作成
const DeleteNetworkAction = React.memo(
  ({
    networkConfiguration,
    onDelete,
  }: {
    networkConfiguration: NetworkConfiguration;
    onDelete: (guid: string) => void;
  }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            削除
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>WiFi設定の削除</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${networkConfiguration.WiFi.SSID}" を削除してもよろしいですか？`}
              <br />
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(networkConfiguration.GUID)}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

export function WifiSsidTable() {
  const [data, setData] = React.useState<NetworkConfigurations>(wifiSsidData);
  const form = useFormContext<FormPolicy>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const handleDelete = React.useCallback(
    (guid: string) => {
      setData((prev) => prev.filter((config) => config.GUID !== guid));
      const currentConfigs =
        form.getValues(
          "policyData.openNetworkConfiguration.NetworkConfigurations"
        ) || [];
      const newConfigs = currentConfigs.filter(
        (config: NetworkConfiguration) => config.GUID !== guid
      );
      form.setValue(
        "policyData.openNetworkConfiguration.NetworkConfigurations",
        newConfigs
      );
    },
    [form]
  );

  const columns = React.useMemo(
    () => [
      ...wifiSsidColumns,
      {
        id: "setSwitch",
        header: "設定",
        cell: ({ row }) => (
          <NetworkConfigSwitch control={form.control} rowData={row.original} />
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const networkConfiguration = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" type="button">
                  <span className="sr-only">メニュー</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>編集</DropdownMenuItem>
                {/* <DropdownMenuItem>削除</DropdownMenuItem> */}
                <DeleteNetworkAction
                  networkConfiguration={networkConfiguration}
                  onDelete={handleDelete}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [form.control, handleDelete]
  );
  // const columnsNOmemo: ColumnDef<NetworkConfiguration>[] = [
  //   ...wifiSsidColumns,
  //   {
  //     id: "setSwitch",
  //     header: "設定",
  //     cell: ({ row }) => (
  //       <FormField
  //         control={form.control}
  //         name={`policyData.openNetworkConfiguration.NetworkConfigurations`}
  //         render={({ field }) => {
  //           const isEnabled = (field.value || []).some(
  //             (config: NetworkConfiguration) =>
  //               config.GUID === row.original.GUID
  //           );

  //           return (
  //             <FormControl>
  //               <Switch
  //                 checked={isEnabled}
  //                 onCheckedChange={(checked) => {
  //                   const currentConfigs = field.value || [];
  //                   const newConfigs = checked
  //                     ? [...currentConfigs, row.original]
  //                     : currentConfigs.filter(
  //                         (config: NetworkConfiguration) =>
  //                           config.GUID !== row.original.GUID
  //                       );

  //                   field.onChange(newConfigs);
  //                 }}
  //               />
  //             </FormControl>
  //           );
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const networkConfiguration = row.original;
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0" type="button">
  //               <span className="sr-only">メニュー</span>
  //               <MoreHorizontal />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuItem>編集</DropdownMenuItem>
  //             {/* <DropdownMenuItem>削除</DropdownMenuItem> */}
  //             <DeleteNetworkAction
  //               networkConfiguration={networkConfiguration}
  //               onDelete={handleDelete}
  //             />
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
  // ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  // console.log("現在のフォームデータ", form.getValues());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">WiFi SSID</CardTitle>
        <CardDescription>Manage your WiFi SSID.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="Filter SSID..."
            value={(table.getColumn("ssid")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("ssid")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="[&:has([role=checkbox])]:pl-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="[&:has([role=checkbox])]:pl-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell> */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
