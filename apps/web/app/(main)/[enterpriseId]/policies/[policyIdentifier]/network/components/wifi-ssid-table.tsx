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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ExternalLinkIcon,
  MoreHorizontal,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

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
import { Control, useForm, useFormContext } from "react-hook-form";
import { FormPolicy } from "@/app/types/policy";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table as ReactTable } from "@tanstack/react-table";
import { InfoPopover } from "@/components/info-popover";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const wifiSeuritySchema = z.enum(["None", "WEP-PSK", "WPA-PSK"]);
const wifiMacRandomizationModeSchema = z
  .enum(["None", "Hardware", "Software"])
  .optional();
const WiFiConfigSchema = z
  .object({
    SSID: z.string().trim().min(1, { message: "SSIDは必須です" }),
    Security: wifiSeuritySchema,
    Passphrase: z.string().trim().optional(),
    AutoConnect: z.boolean(),
    MACAddressRandomizationMode: wifiMacRandomizationModeSchema,
  })
  .superRefine((val, ctx) => {
    // 親オブジェクトのSecurityの値を取得
    const { Security, Passphrase } = val;

    // セキュリティがNoneの場合は検証をスキップ
    if (Security === "None") return;

    // パスワードが未設定の場合
    if (!Passphrase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "セキュリティタイプが設定されている場合、パスワードは必須です",
        path: ["Passphrase"],
      });
      return;
    }

    // パスワードの長さチェック
    if (Passphrase.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "セキュリティタイプが設定されている場合、パスワードは8文字以上必要です",
        path: ["Passphrase"],
      });
      return;
    }
  });

const NetworkConfigurationSchema = z.object({
  GUID: z.string(),
  Name: z.string(),
  Type: z.literal("WiFi"),
  WiFi: WiFiConfigSchema,
});

type WiFiConfig = z.infer<typeof WiFiConfigSchema>;
type NetworkConfiguration = z.infer<typeof NetworkConfigurationSchema>;

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
      AutoConnect: true,
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
      AutoConnect: true,
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
      AutoConnect: true,
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
          (config) => config.GUID === rowData.GUID
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
                      (config) => config.GUID !== rowData.GUID
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

// 複数選択したSSIDを削除するコンポーネント
const DeleteSelectedNetworksButton = ({
  table,
  onDeleteSelected,
}: {
  table: ReactTable<NetworkConfiguration>;
  onDeleteSelected: (guids: string[]) => void;
}) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  // 選択された行からSSID名を取得
  const selectedSsids = selectedRows.map((row) => row.original.WiFi.SSID);

  // 選択された行からGUIDを取得
  const selectedGuids = selectedRows.map((row) => row.original.GUID);

  return (
    <AlertDialog>
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
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>WiFi設定の一括削除</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedRows.length}件のWiFi設定を削除しようとしています。
            {selectedSsids.length <= 5 ? (
              <>
                <br />
                {selectedSsids.map((ssid: string) => (
                  <span key={ssid} className="block">
                    ・{ssid}
                  </span>
                ))}
              </>
            ) : (
              <span className="block">
                ・{selectedSsids.slice(0, 3).join(", ")} など
              </span>
            )}
            <br />
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDeleteSelected(selectedGuids)}>
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const defaultValues: WiFiConfig = {
  SSID: "",
  Security: "None",
  Passphrase: "",
  AutoConnect: true,
  MACAddressRandomizationMode: "None",
};

const WifiSsidFormDialog = React.memo(
  ({
    networkConfiguration,
    onAdd,
    onUpdate,
    open,
    setOpen,
    mode = "create",
    setDropdownOpen,
  }: {
    networkConfiguration?: NetworkConfiguration;
    onAdd?: (networkConfig: NetworkConfiguration) => void;
    onUpdate?: (guid: string, updatedConfig: WiFiConfig) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    mode?: "create" | "edit";
    setDropdownOpen?: (open: boolean) => void;
  }) => {
    // 編集モードの場合は既存の設定を初期値として使用し、作成モードの場合はデフォルト値を使用
    const initialValues =
      mode === "edit" && networkConfiguration
        ? {
            SSID: networkConfiguration.WiFi.SSID,
            Security: networkConfiguration.WiFi.Security,
            Passphrase: networkConfiguration.WiFi.Passphrase || "",
            AutoConnect: networkConfiguration.WiFi.AutoConnect,
            MACAddressRandomizationMode:
              networkConfiguration.WiFi.MACAddressRandomizationMode || "None",
          }
        : defaultValues;

    const form = useForm<WiFiConfig>({
      mode: "onChange",
      resolver: zodResolver(WiFiConfigSchema),
      defaultValues: initialValues,
    });

    const securityType = form.watch("Security");
    const isNoneSecurity = securityType === "None";
    const { isValid } = form.formState;

    const onSubmit = (data: WiFiConfig) => {
      if (mode === "edit" && onUpdate && networkConfiguration) {
        // 編集モードの場合
        onUpdate(networkConfiguration.GUID, data);
      } else if (mode === "create" && onAdd) {
        // 作成モードの場合
        const newGuid = uuidv7();
        const newNetworkConfig: NetworkConfiguration = {
          GUID: newGuid,
          Name: data.SSID,
          Type: "WiFi",
          WiFi: {
            SSID: data.SSID,
            Security: data.Security,
            Passphrase: data.Passphrase,
            AutoConnect: data.AutoConnect,
            MACAddressRandomizationMode: data.MACAddressRandomizationMode,
          },
        };
        onAdd(newNetworkConfig);
      }

      form.reset();
      setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        form.reset();
      }
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
          SSID: networkConfiguration.WiFi.SSID,
          Security: networkConfiguration.WiFi.Security,
          Passphrase: networkConfiguration.WiFi.Passphrase || "",
          AutoConnect: networkConfiguration.WiFi.AutoConnect,
          MACAddressRandomizationMode:
            networkConfiguration.WiFi.MACAddressRandomizationMode || "None",
        });
      }
    }, [form, mode, networkConfiguration, open]);

    return (
      // <Dialog open={open} onOpenChange={handleOpenChange} defaultOpen={true}>
      //   <DialogTrigger asChild>
      //     <Button size="sm">
      //       <PlusIcon className="size-4 mr-2" />
      //       追加
      //     </Button>
      //   </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("エラー", errors);
            })}
            // className="space-y-8"
          >
            <DialogHeader className="space-y-2">
              <DialogTitle>WiFi SSID設定の追加</DialogTitle>
              <DialogDescription>
                新しいWiFiのSSID設定を追加します。
                <br />
                必要な情報を入力してください。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 space-y-2">
              <FormField
                control={form.control}
                name="SSID"
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
                name="Security"
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
                name="Passphrase"
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
                name="AutoConnect"
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
                name="MACAddressRandomizationMode"
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
              <Button
                type="submit"
                //  disabled={!isValid}
                className="mb-2"
              >
                追加
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      // </Dialog>
    );
  }
);

// 追加ボタンコンポーネント
const CreateWifiSsidButton = React.memo(
  ({ onAdd }: { onAdd: (networkConfig: NetworkConfiguration) => void }) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="size-4 mr-2" />
            追加
          </Button>
        </DialogTrigger>
        <WifiSsidFormDialog
          onAdd={onAdd}
          open={open}
          setOpen={setOpen}
          mode="create"
        />
      </Dialog>
    );
  }
);

// 編集ボタンコンポーネント
const EditNetworkAction = React.memo(
  ({
    networkConfiguration,
    onUpdate,
    dialogOpen,
    setDialogOpen,
    dropdownOpen,
    setDropdownOpen,
  }: {
    networkConfiguration: NetworkConfiguration;
    onUpdate: (guid: string, updatedConfig: WiFiConfig) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    dropdownOpen: boolean;
    setDropdownOpen: (open: boolean) => void;
  }) => {
    // const [open, setOpen] = React.useState(false);
    return (
      <>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setDialogOpen(true);
            // setDropdownOpen(false);
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
            onUpdate={onUpdate}
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

export function WifiSsidTable() {
  const [data, setData] = React.useState<NetworkConfigurations>(wifiSsidData);
  const form = useFormContext<FormPolicy>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  // 有効なネットワークのGUIDを管理するstate
  const [enabledGuids, setEnabledGuids] = React.useState<string[]>();
  // このハンドラをメモカすると、Switchが滑らかになる
  const handleDelete = React.useCallback((guid: string) => {
    setEnabledGuids((prev) => prev?.filter((g) => g !== guid));
    setData((prev) => prev.filter((config) => config.GUID !== guid));
  }, []);

  // enabledGuidsが変更されたらフォームの値を更新
  React.useEffect(() => {
    if (!enabledGuids) {
      return;
    }
    const enabledConfigs = data.filter((network) =>
      enabledGuids?.includes(network.GUID)
    );
    form.setValue(
      "policyData.openNetworkConfiguration.NetworkConfigurations",
      enabledConfigs
    );
  }, [enabledGuids, data, form]);

  // Switchの切り替え処理
  const handleNetworkToggle = React.useCallback(
    (guid: string, enabled: boolean) => {
      setEnabledGuids((prev) => {
        return prev
          ? enabled
            ? [...prev, guid]
            : prev.filter((g) => g !== guid)
          : [guid];
      });
    },
    []
  );
  // ネットワーク設定を更新するハンドラ
  const handleUpdateNetwork = React.useCallback(
    (guid: string, updatedConfig: WiFiConfig) => {
      setData((prev) =>
        prev.map((config) =>
          config.GUID === guid
            ? {
                ...config,
                Name: updatedConfig.SSID, // 名前も更新
                WiFi: updatedConfig,
              }
            : config
        )
      );
    },
    []
  );

  const columns = React.useMemo(
    () => [
      ...wifiSsidColumns,
      {
        id: "setSwitch",
        header: "設定",
        cell: ({ row }) => {
          const networkConfiguration = row.original;
          const GUID = networkConfiguration.GUID;
          const isEnabled = enabledGuids?.includes(GUID);
          const [dropdownOpen, setDropdownOpen] = React.useState(false);
          const [dialogOpen, setDialogOpen] = React.useState(false);
          return (
            <div className="flex items-center gap-4">
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) =>
                  handleNetworkToggle(GUID, checked)
                }
              />
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
                    onUpdate={handleUpdateNetwork}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                  />
                  <DeleteNetworkAction
                    networkConfiguration={networkConfiguration}
                    onDelete={handleDelete}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleNetworkToggle, handleUpdateNetwork]
  );

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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  // console.log("現在のformの値", form.getValues());
  // 新しいネットワーク設定を追加するハンドラ
  const handleAddNetwork = React.useCallback(
    (networkConfig: NetworkConfiguration) => {
      setData((prev) => [...prev, networkConfig]);

      // 追加したネットワークを有効にする
      setEnabledGuids((prev) => {
        const newGuids = prev ? [...prev] : [];
        if (!newGuids.includes(networkConfig.GUID)) {
          newGuids.push(networkConfig.GUID);
        }
        return newGuids;
      });
    },
    []
  );
  // 複数のネットワーク設定を削除するハンドラ
  const handleDeleteSelected = React.useCallback((guids: string[]) => {
    // 選択された行のGUIDを使って、データから該当する項目を削除
    setData((prev) => prev.filter((config) => !guids.includes(config.GUID)));
    // 有効なネットワークからも削除
    setEnabledGuids((prev) =>
      prev ? prev.filter((guid) => !guids.includes(guid)) : []
    );

    // 選択状態をリセット
    setRowSelection({});
  }, []);

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
            onDeleteSelected={handleDeleteSelected}
          />
          <CreateWifiSsidButton onAdd={handleAddNetwork} />
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
