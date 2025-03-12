"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import Image from "next/image";
import BusinessmanBowing from "./images/businessman_bowing.png";
import { sendWaitingNotification } from "../actions/email";

interface UserLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export default function UserLimitDialog({
  open,
  onOpenChange,
  email,
}: UserLimitDialogProps) {
  const handleWaitingListSubmit = async () => {
    try {
      toast.success("空き枠ができた際にお知らせします。");
      await sendWaitingNotification({
        username: "test",
        projectName: "test",
        email: email,
        ip_address: "127.0.0.1",
        location: "test",
        createdAt: new Date().toLocaleString("ja-JP"),
      });
    } catch (error) {
      toast.error("待機リストへの登録に失敗しました。");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="space-y-5">
        <AlertDialogHeader className="">
          <AlertDialogTitle>利用制限のお知らせ</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6 lg:w-3/5 mx-auto">
          <Image src={BusinessmanBowing} alt="businessman bowing" priority />
        </div>
        <AlertDialogDescription className="mx-auto text-start lg:text-lg">
          現在、ユーザーの利用上限数に達しています。
          <br />
          空き枠ができた際にメールでお知らせしてもよろしいでしょうか？
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleWaitingListSubmit} type="button">
            はい、お知らせを希望します
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
