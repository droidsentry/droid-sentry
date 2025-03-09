"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormPolicy } from "@/app/types/policy";

export default function WifiTableForm({
  policyIdentifier,
}: {
  policyIdentifier: string;
}) {
  const form = useFormContext<FormPolicy>();

  return (
    <form className="space-y-1">
      <h2 className="text-lg font-bold">Wi-Fi設定</h2>
      <FormField
        control={form.control}
        name="policyData.deviceConnectivityManagement.usbDataAccess"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4 gap-2">
            <FormLabel>Wi-Fi設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "ALLOW_WIFI_CONFIGURATION"}
              value={field.value ?? "ALLOW_WIFI_CONFIGURATION"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wi-Fi設定の許可" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ALLOW_WIFI_CONFIGURATION">
                  Wi-Fi設定を許可
                </SelectItem>
                <SelectItem value="ALLOW_WIFI_ADDITION">
                  Wi-Fi設定追加のみ禁止
                </SelectItem>
                <SelectItem value="DISALLOW_WIFI_CONFIGURATION">
                  Wi-Fi設定変更を禁止
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {/* {field.value === "ALLOW_WIFI_CONFIGURATION" &&
                "デフォルトとして「Wi-Fi設定を許可」が設定されます。"}
              {field.value === "ALLOW_WIFI_ADDITION" &&
                "Wi-Fi設定追加のみ禁止"}
              {field.value === "DISALLOW_WIFI_CONFIGURATION" &&
                "Wi-Fi設定変更を禁止"} */}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="w-full border rounded-lg p-1">
        <div className="flex justify-between my-1 gap-2">
          <Input placeholder="SSIDを検索" className="w-1/3 h-8" />
          <span className="flex-1" />
          <Button variant="outline" className="h-8" size="icon">
            <TrashIcon className="size-4" />
          </Button>
          <Button className="h-8">
            <PlusIcon className="size-4" />
            追加
          </Button>
        </div>
        <div className="w-full border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/8 text-center font-bold"></TableHead>
                <TableHead className="w-3/8 text-center font-bold">
                  SSID
                </TableHead>
                <TableHead className="w-2/8 text-center font-bold">
                  セキュリティ
                </TableHead>
                <TableHead className="w-1/8 text-center font-bold">
                  メモ
                </TableHead>
                <TableHead className="w-1/8 text-center font-bold">
                  設定
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="flex justify-center items-center">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">test-ssid-WPA3</TableCell>
                <TableCell>WPA3</TableCell>
                <TableCell>test-memo-WPA3</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <Switch onCheckedChange={() => {}} className="" />
                  <Button size="icon" variant="ghost">
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex justify-center items-center">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">test-ssid-WPA2</TableCell>
                <TableCell>WPA2</TableCell>
                <TableCell>test-memo-WPA2</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <Switch onCheckedChange={() => {}} className="" />
                  <Button size="icon" variant="ghost">
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex justify-center items-center">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">test-ssid-WEP</TableCell>
                <TableCell>WEP</TableCell>
                <TableCell>test-memo-WEP</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <Switch onCheckedChange={() => {}} className="" />
                  <Button size="icon" variant="ghost">
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex justify-center items-center">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">test-ssid-None</TableCell>
                <TableCell>None</TableCell>
                <TableCell>test-memo-None</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <Switch onCheckedChange={() => {}} className="" />
                  <Button size="icon" variant="ghost">
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </form>
  );
}
