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
import { Button } from "@/components/ui/button";
import {
  Download,
  EllipsisIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Loader2Icon,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useTransition } from "react";

import { AppsTableType } from "@/app/types/apps";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppsInfoSheet } from "../../../providers/apps-info-sheet";
import { deleteApp } from "../../actions/delete-app";

interface DataTableMenuProps {
  row: Row<AppsTableType>;
  className?: string;
}

export default function AppsTableMenu({ row, className }: DataTableMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPendingMenu, startTransition] = useTransition();
  const { isPending } = useAppsInfoSheet();
  const router = useRouter();
  const pathname = usePathname();

  const handleViewInfo = () => {
    router.push(`${pathname}?appId=${row.original.appId}`);
  };

  const handleExternalLink = () => {
    const url = row.original.playStoreUrl;
    window.open(url, "_blank");
  };
  const handleDownload = async () => {
    window.location.href = `/api/download?appId=${row.original.appId}`;
    console.log(`/api/download?appId=${row.original.appId}`);
  };

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteApp(pathname, row.original.appId)
        .then(() => {
          toast.success("アプリを削除しました。");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-8", className)}>
            <EllipsisIcon className="h-4 w-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className=" space-y-1 px-2" align="end">
          <DropdownMenuItem onSelect={handleViewInfo} disabled={isPending}>
            {isPending ? (
              <div className="flex items-center">
                <Loader2Icon className="mr-4 h-4 w-4 animate-spin" />
                <span>読み込み中...</span>
              </div>
            ) : (
              <>
                <FileTextIcon className="mr-4 h-4 w-4" />
                <span>アプリ詳細 を開く</span>
              </>
            )}
          </DropdownMenuItem>
          {row.original.distributionChannel === "PUBLIC_GOOGLE_HOSTED" && (
            <DropdownMenuItem onClick={handleExternalLink}>
              <ExternalLinkIcon className="mr-4 h-4 w-4" />
              <span>Play Store を開く</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-4 h-4 w-4" />
            <span>アプリ情報をダウンロード</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => setIsDialogOpen(true)}
            disabled={isPendingMenu}
          >
            {isPendingMenu ? (
              <div className="flex items-center">
                <Loader2Icon className="mr-4 h-4 w-4 animate-spin" />
                <span>削除中...</span>
              </div>
            ) : (
              <>
                <Trash2 className="mr-4 h-4 w-4 text-red-500" />
                <span className="text-red-500">削除</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              本当に削除してもよろしいでしょうか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              アプリ情報を削除しても、配信されているアプリはアンインストールされません。
              次回のポリシー更新時には、自動的にアンインストールされます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
