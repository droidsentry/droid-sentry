"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { startLostModeSelectedDevice } from "../../../actions/lost-mode-devices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceLostModeSchema } from "@/lib/schemas/devices";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { DeviceLostMode, DeviceTableType } from "@/lib/types/device";

export default function StartLostModeAlertDialog({
  isStartLostModeDialogOpen,
  setIsStartLostModeDialogOpen,
  enterpriseId,
  devices,
}: {
  isStartLostModeDialogOpen: boolean;
  setIsStartLostModeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  devices: DeviceTableType[];
}) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(DeviceLostModeSchema),
    defaultValues: {
      lostOrganization: "",
      lostMessage: "",
      lostPhoneNumber: "",
      lostEmailAddress: "",
      lostStreetAddress: "",
    },
  });

  const handleStartLostMode = async (formData: DeviceLostMode) => {
    if (!enterpriseId) {
      toast.error("紛失モードに失敗しました。");
      return;
    }
    await startLostModeSelectedDevice(enterpriseId, devices, formData)
      .then(() => {
        toast.success("紛失モードを有効にしました");
        // setIsLostMode(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <AlertDialog
      open={isStartLostModeDialogOpen}
      onOpenChange={setIsStartLostModeDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に紛失モードを開始してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            画面ロックが設定されていないデバイスは、紛失モード画面は表示されますが、画面ロックは実行されません。
            画面ロックを設定する場合は、パスワードリセットをご利用ください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleStartLostMode)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="lostOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>組織名</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lostMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メッセージ</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lostPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電話番号</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lostEmailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lostStreetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>住所</FormLabel>
                  <FormControl>
                    <Textarea autoComplete="street-address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isValidating
                }
                type="submit"
              >
                紛失モードを開始
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
