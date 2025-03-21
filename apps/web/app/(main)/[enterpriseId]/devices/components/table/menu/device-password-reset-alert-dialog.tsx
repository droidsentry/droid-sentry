"use client";

import PasswordForm from "@/app/(auth)/components/password-form";
import { DeviceResetPasswordSchema } from "@/app/schemas/devices";
import { DeviceResetPassword } from "@/app/types/device";
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
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPasswordDevices } from "../../../actions/password-reset-device";
import { Table } from "@tanstack/react-table";

interface DevicePasswordResetAlertDialogProps<TData> {
  isPasswordResetDialogOpen: boolean;
  setIsPasswordResetDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifiers: string[];
  table?: Table<TData>;
}
export default function DevicePasswordResetAlertDialog<TData>({
  isPasswordResetDialogOpen,
  setIsPasswordResetDialogOpen,
  enterpriseId,
  deviceIdentifiers,
  table,
}: DevicePasswordResetAlertDialogProps<TData>) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(DeviceResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleRemoteLookDevice = async (formData: DeviceResetPassword) => {
    if (!enterpriseId || !deviceIdentifiers) {
      toast.error("デバイスのロックに失敗しました。");
      return;
    }
    await resetPasswordDevices({
      formData,
      deviceIdentifiers,
      enterpriseId,
    })
      .then(() => {
        toast.success("デバイスのパスワードをリセットしました。");
        table?.resetRowSelection();
      })
      .catch((error) => {
        toast.error("デバイスのパスワードリセットに失敗しました。");
        console.error("デバイスのパスワードリセットに失敗しました。", error);
      })
      .finally(() => {
        setIsPasswordResetDialogOpen(false);
        form.reset();
      });
  };
  return (
    <AlertDialog
      open={isPasswordResetDialogOpen}
      onOpenChange={setIsPasswordResetDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当にパスワードリセットを開始してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            パスワードリセット後、デバイスはロックされます。
            6文字以上のパスワードを設定してください。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRemoteLookDevice)}>
            <PasswordForm
              label="新しいパスワード"
              form={form}
              name="password"
              autoComplete="new-password"
              minLength={6}
            />

            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isValidating
                }
                type="submit"
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
