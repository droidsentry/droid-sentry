"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLinkIcon,
  Loader2,
  MoreHorizontal,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import * as React from "react";

import { FormPolicy } from "@/app/types/policy";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Control, useForm, useFormContext } from "react-hook-form";

import LoadingWithinPageSkeleton from "@/app/(main)/[enterpriseId]/components/loading-within-page-sleleton";
import { NetworkConfigurationSchema } from "@/app/schemas/policy-network";
import { RouteParams } from "@/app/types/enterprise";
import {
  NetworkConfiguration,
  NetworkConfigurations,
} from "@/app/types/policy-network";
import { InfoPopover } from "@/components/info-popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";
import { v7 as uuidv7 } from "uuid";
import {
  createOrUpdateNetworkConfigurations,
  deleteNetworkConfiguration,
  deleteNetworkConfigurations,
  getNetworkConfigurations,
} from "../actions/network";

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SSID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="truncate">{row.getValue("ssid")}</div>,
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
      <div className="truncate">{row.getValue("security")}</div>
    ),
  },
];

// 削除用のアクションコンポーネントを作成
const DeleteNetworkAction = React.memo(
  ({
    networkConfiguration,
    onDelete,
    setDropdownOpen,
  }: {
    networkConfiguration: NetworkConfiguration;
    onDelete: (guid: string) => void;
    setDropdownOpen: (open: boolean) => void;
  }) => {
    return (
      <AlertDialog onOpenChange={(open) => !open && setDropdownOpen(false)}>
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
            <AlertDialogCancel type="button">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={() => {
                onDelete(networkConfiguration.GUID);
              }}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

// 複数選択したSSIDを削除するコンポーネント
const DeleteSelectedNetworksButton = ({
  table,
  enterpriseId,
  policyIdentifier,
}: {
  table: ReactTable<NetworkConfiguration>;
  enterpriseId: string;
  policyIdentifier: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;
  // 選択された行からGUIDを取得
  const selectedGuids = selectedRows.map((row) => row.original.GUID);

  const handleDeleteSelected = async () => {
    startTransition(async () => {
      await deleteNetworkConfigurations(
        enterpriseId,
        policyIdentifier,
        selectedGuids
      )
        .then(() => {
          toast.success("ネットワーク設定の削除に成功しました");
        })
        .catch(() => {
          toast.error("ネットワーク設定の削除に失敗しました");
        });
      table.resetRowSelection();
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasSelectedRows}
          title={
            hasSelectedRows
              ? "選択した項目を削除"
              : "削除する項目を選択してください"
          }
        >
          <TrashIcon className="size-4" />
          <span className="sr-only">削除</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>WiFi設定の一括削除</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedRows.length}件のWiFi設定を削除しようとしています。
            {selectedRows.length <= 5 ? (
              <>
                <br />
                {selectedRows.map((row) => (
                  <span key={row.original.GUID} className="block">
                    ・{row.original.WiFi.SSID}
                  </span>
                ))}
              </>
            ) : (
              <span className="block">
                ・
                {selectedRows
                  .slice(0, 3)
                  .map((row) => row.original.WiFi.SSID)
                  .join(", ")}{" "}
                など
              </span>
            )}
            <br />
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">キャンセル</AlertDialogCancel>

          <Button
            onClick={handleDeleteSelected}
            type="button"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "削除"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const defaultValues: NetworkConfiguration = {
  GUID: "",
  Name: "",
  Type: "WiFi",
  WiFi: {
    SSID: "",
    Security: "None",
    Passphrase: "",
    AutoConnect: true,
    MACAddressRandomizationMode: undefined,
  },
};

const WifiSsidFormDialog = ({
  networkConfiguration,
  open,
  setOpen,
  mode = "create",
  setDropdownOpen,
}: {
  networkConfiguration?: NetworkConfiguration;
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  setDropdownOpen?: (open: boolean) => void;
}) => {
  const [isPending, startTransition] = React.useTransition();
  // 編集モードの場合は既存の設定を初期値として使用し、作成モードの場合はデフォルト値を使用
  const initialValues: NetworkConfiguration =
    mode === "edit" && networkConfiguration
      ? {
          GUID: networkConfiguration.GUID,
          Name: networkConfiguration.Name,
          Type: networkConfiguration.Type,
          WiFi: {
            SSID: networkConfiguration.WiFi.SSID,
            Security: networkConfiguration.WiFi.Security,
            Passphrase: networkConfiguration.WiFi.Passphrase || "",
            AutoConnect: networkConfiguration.WiFi.AutoConnect,
            MACAddressRandomizationMode:
              networkConfiguration.WiFi.MACAddressRandomizationMode,
          },
        }
      : defaultValues;

  const form = useForm<NetworkConfiguration>({
    mode: "onChange",
    resolver: zodResolver(NetworkConfigurationSchema),
    defaultValues: initialValues,
  });

  const securityType = form.watch("WiFi.Security");
  const isNoneSecurity = securityType === "None";
  const { isValid } = form.formState;

  const { enterpriseId, policyIdentifier } = useParams<RouteParams>();

  const handleCreateOrUpdateNetwork = (data: NetworkConfiguration) => {
    const newNetworkConfig: NetworkConfiguration = {
      GUID: data.GUID || uuidv7(),
      Name: data.Name || data.WiFi.SSID,
      Type: "WiFi",
      WiFi: {
        SSID: data.WiFi.SSID,
        Security: data.WiFi.Security,
        Passphrase: data.WiFi.Passphrase,
        AutoConnect: data.WiFi.AutoConnect,
        MACAddressRandomizationMode: data.WiFi.MACAddressRandomizationMode,
      },
    };
    startTransition(async () => {
      await createOrUpdateNetworkConfigurations(
        enterpriseId,
        policyIdentifier,
        newNetworkConfig
      )
        .then(() => {
          toast.success("ネットワーク設定の作成に成功しました");
        })
        .catch((error) => {
          // console.error(error);
          toast.error(error.message);
        });
    });

    form.reset();
    setOpen(false);
  };
  // ダイアログのタイトルとボタンテキストを設定
  const dialogTitle =
    mode === "edit" ? "WiFi SSID設定の編集" : "WiFi SSID設定の追加";
  const dialogDescription =
    mode === "edit"
      ? "WiFiのSSID設定を編集します。"
      : "新しいWiFiのSSID設定を追加します。";
  const submitButtonText = mode === "edit" ? "更新" : "追加";

  // useEffectを使用して、編集モードでダイアログが開かれたときにフォームの値を設定
  React.useEffect(() => {
    if (mode === "edit" && networkConfiguration && open) {
      form.reset({
        GUID: networkConfiguration.GUID,
        Name: networkConfiguration.Name,
        Type: networkConfiguration.Type,
        WiFi: {
          SSID: networkConfiguration.WiFi.SSID,
          Security: networkConfiguration.WiFi.Security,
          Passphrase: networkConfiguration.WiFi.Passphrase || "",
          AutoConnect: networkConfiguration.WiFi.AutoConnect,
          MACAddressRandomizationMode:
            networkConfiguration.WiFi.MACAddressRandomizationMode,
        },
      });
    }
  }, [form, mode, networkConfiguration, open]);
  return (
    <DialogContent className="sm:max-w-[600px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateOrUpdateNetwork, (errors) => {
            console.log("エラー", errors);
          })}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 space-y-2">
            <FormField
              control={form.control}
              name="WiFi.SSID"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">SSID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="SSIDを入力してください"
                      {...field}
                      className="col-span-3 m-0"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="WiFi.Security"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">セキュリティ</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 col-span-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="None" />
                        </FormControl>
                        <FormLabel className="font-normal">なし</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="WEP-PSK" />
                        </FormControl>
                        <FormLabel className="font-normal">WEP-PSK</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="WPA-PSK" />
                        </FormControl>
                        <FormLabel className="font-normal">WPA-PSK</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="WiFi.Passphrase"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">パスワード</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="new-password"
                      disabled={isNoneSecurity}
                      {...field}
                      className="col-span-3 m-0"
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="WiFi.AutoConnect"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center justify-center gap-4 space-y-0">
                  <FormLabel className="text-right">自動接続</FormLabel>
                  <FormControl>
                    <Switch
                      id="autoConnect"
                      className=" self-center"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-start">
                    {field.value ? "有効" : "無効"}
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="WiFi.MACAddressRandomizationMode"
              render={({ field }) => (
                <FormItem className="space-y-0 grid grid-cols-4 items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-right leading-relaxed">
                      MACアドレス
                      <br />
                      ランダム化
                    </FormLabel>
                    <InfoPopover
                      content={
                        <div>
                          <p>
                            MACアドレスランダム化は、Wi-Fiネットワークに接続する際のプライバシー保護機能です。
                          </p>
                          <p className="mt-2">
                            ハードウェアとソフトウェアのオプションはAndroid
                            13以降で利用可能です。
                          </p>
                          <Link
                            href="https://source.android.com/docs/core/connect/wifi-mac-randomization-behavior?hl=ja#types"
                            target="_blank"
                            className="text-primary flex items-center gap-1 hover:underline"
                          >
                            詳しくはこちら
                            <ExternalLinkIcon className="size-4" />
                          </Link>
                        </div>
                      }
                    />
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value === "" ? undefined : value);
                      }}
                      defaultValue={field.value || ""}
                      className="flex flex-col space-y-1 col-span-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="" />
                        </FormControl>
                        <FormLabel className="font-normal">なし</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="Hardware" />
                        </FormControl>
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-normal">
                            ハードウェア
                          </FormLabel>
                          <InfoPopover
                            content={
                              <div>
                                <p>
                                  ネットワークに接続する際、工場出荷時のMACアドレスを使用します。
                                </p>
                                <Link
                                  href="https://source.android.com/docs/core/connect/wifi-mac-randomization-behavior?hl=ja#types"
                                  target="_blank"
                                  className="text-primary flex items-center gap-1 hover:underline"
                                >
                                  詳しくはこちら
                                  <ExternalLinkIcon className="size-4" />
                                </Link>
                              </div>
                            }
                          />
                        </div>
                        <span className="pl-3 text-muted-foreground">
                          Android 13 以降
                        </span>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 h-6">
                        <FormControl>
                          <RadioGroupItem value="Software" />
                        </FormControl>
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-normal">
                            自動設定
                          </FormLabel>
                          <InfoPopover
                            content={
                              <div>
                                <p>
                                  Wi-FiフレームワークがMACアドレスをランダムに設定します。ネットワークに接続する際、永続的または非永続的にランダムに生成されたMACアドレスのいずれかになります。
                                </p>
                                <Link
                                  href="https://source.android.com/docs/core/connect/wifi-mac-randomization-behavior?hl=ja"
                                  target="_blank"
                                  className="text-primary flex items-center gap-1 hover:underline"
                                >
                                  MAC アドレス ランダム化の動作
                                  <ExternalLinkIcon className="size-4" />
                                </Link>
                              </div>
                            }
                          />
                        </div>
                        <span className="pl-3 text-muted-foreground">
                          Android 13 以降
                        </span>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setDropdownOpen?.(false);
                setOpen(false);
                form.reset();
              }}
              className="mb-2"
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={!isValid} className="mb-2">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

// 追加ボタンコンポーネント
function CreateWifiSsidButton({
  table,
}: {
  table: ReactTable<NetworkConfiguration>;
}) {
  const [open, setOpen] = React.useState(false);
  // const maxSsids = table.getFilteredRowModel().rows.length
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4 mr-2" />
          追加
        </Button>
      </DialogTrigger>
      <WifiSsidFormDialog open={open} setOpen={setOpen} mode="create" />
    </Dialog>
  );
}

// 編集ボタンコンポーネント
const EditNetworkAction = React.memo(
  ({
    networkConfiguration,
    dialogOpen,
    setDialogOpen,
    setDropdownOpen,
  }: {
    networkConfiguration: NetworkConfiguration;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    setDropdownOpen: (open: boolean) => void;
  }) => {
    // const [open, setOpen] = React.useState(false);
    return (
      <>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
        >
          編集
        </DropdownMenuItem>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            setDropdownOpen(false);
          }}
        >
          <WifiSsidFormDialog
            networkConfiguration={networkConfiguration}
            open={dialogOpen}
            setOpen={setDialogOpen}
            mode="edit"
            setDropdownOpen={setDropdownOpen}
          />
        </Dialog>
      </>
    );
  }
);

function SwitchCell({
  networkConfiguration,
}: {
  networkConfiguration: NetworkConfiguration;
}) {
  const form = useFormContext<FormPolicy>();
  const networkConfigPath =
    "policyData.openNetworkConfiguration.NetworkConfigurations";
  const currentActiveNetworkConfigurations =
    form.watch(networkConfigPath) ?? [];
  const currentActiveGuids = currentActiveNetworkConfigurations?.map(
    (config) => config.GUID
  );
  const GUID = networkConfiguration.GUID;
  const isEnabled = currentActiveGuids?.includes(GUID);

  return (
    <div className="flex items-center gap-4">
      <Switch
        checked={isEnabled}
        onCheckedChange={(checked) => {
          return currentActiveGuids
            ? checked
              ? form.setValue(networkConfigPath, [
                  ...currentActiveNetworkConfigurations,
                  networkConfiguration,
                ])
              : form.setValue(
                  networkConfigPath,
                  currentActiveNetworkConfigurations.filter(
                    (config) => config.GUID !== GUID
                  )
                )
            : form.setValue(networkConfigPath, [networkConfiguration]);
        }}
      />
    </div>
  );
}

export function WifiSsidTable({
  enterpriseId,
  policyIdentifier,
  networkConfigurations,
}: {
  enterpriseId: string;
  policyIdentifier: string;
  networkConfigurations: NetworkConfigurations;
}) {
  const key = `/api/devices/${enterpriseId}/wifi-ssid`;
  const { data, error, isLoading, isValidating } =
    useSWRImmutable<NetworkConfigurations>(
      key,
      () => {
        return getNetworkConfigurations(enterpriseId);
      },
      {
        fallbackData: networkConfigurations,
      }
    );
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading || isValidating) return <LoadingWithinPageSkeleton />;

  const form = useFormContext<FormPolicy>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  // ネットワーク設定を削除するハンドラ
  const handleDelete = React.useCallback(
    async (guid: string) => {
      await deleteNetworkConfiguration(enterpriseId, policyIdentifier, guid)
        .then(() => {
          toast.success("ネットワーク設定の削除に成功しました");
        })
        .catch(() => {
          toast.error("ネットワーク設定の削除に失敗しました");
        });
    },
    [enterpriseId, policyIdentifier]
  );

  const columns: ColumnDef<NetworkConfiguration>[] = React.useMemo(
    () => [
      ...wifiSsidColumns,
      {
        id: "setSwitch",
        header: "設定",
        cell: ({ row }) => {
          const networkConfiguration = row.original;
          const [dropdownOpen, setDropdownOpen] = React.useState(false);
          const [dialogOpen, setDialogOpen] = React.useState(false);
          return (
            <div className="flex items-center gap-4">
              <SwitchCell networkConfiguration={networkConfiguration} />
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" type="button">
                    <span className="sr-only">メニュー</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditNetworkAction
                    networkConfiguration={networkConfiguration}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    setDropdownOpen={setDropdownOpen}
                  />
                  <DeleteNetworkAction
                    networkConfiguration={networkConfiguration}
                    onDelete={handleDelete}
                    setDropdownOpen={setDropdownOpen}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleDelete]
  );

  const table = useReactTable({
    data: data ?? [],
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const isFormLoading =
    policyIdentifier !== "new" && // 新規作成時はローディングチェックをスキップ
    !form.formState.isDirty && // フォームが一度も編集されていない
    !form.getValues("policyDisplayName");

  if (isFormLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">WiFi SSID</CardTitle>
        <CardDescription>
          WiFiのSSIDを管理します。
          <br />
          ネットワーク設定を追加すると、デバイスに自動的に適用されます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="SSIDを検索"
            value={(table.getColumn("ssid")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("ssid")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <span className="flex-1" />
          <DeleteSelectedNetworksButton
            table={table}
            enterpriseId={enterpriseId}
            policyIdentifier={policyIdentifier}
          />
          <CreateWifiSsidButton table={table} />
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    SSIDはありません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end  space-x-4 lg:space-x-8 pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">行数：</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-nowrap items-center justify-center text-sm font-medium">
            ページ {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              className=""
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">前のページ</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className=""
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">次のページ</span>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
