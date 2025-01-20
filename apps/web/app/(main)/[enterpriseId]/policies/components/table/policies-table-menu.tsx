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
  PenBoxIcon,
  RefreshCw,
  Trash2,
  UploadIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { deletePolicy } from "../../actions/delete-policy";

import { toast } from "sonner";
import { PolicyTableType } from "../../types/policy";
import { usePoliciesTable } from "../policies-table-provider";
import { revalidatePath } from "next/cache";

interface DataTableMenuProps {
  row: Row<PolicyTableType>;
}

export default function PoliciesTableMenu({ row }: DataTableMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { enterpriseId } = usePoliciesTable();
  const router = useRouter();

  // const key = `/api/policies/table/${enterpriseName}`;
  // const { deletePolicyTableData } = usePoliciesTableData(key, enterpriseName);

  const onClick = async () => {
    console.log(parent);
  };
  const handleDelete = async () => {
    const policyIdentifier = row.original.policyIdentifier;
    if (policyIdentifier === "default") {
      toast.error("デフォルトポリシーは削除できません。");
      return;
    }
    await deletePolicy(enterpriseId, policyIdentifier)
      .then(async () => {
        toast.success("ポリシーを削除しました。");
        revalidatePath(`/${enterpriseId}/policies`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const handleEditPolicy = async () => {
    const policyIdentifier = row.original.policyIdentifier;
    router.push(`/${enterpriseId}/policies/${policyIdentifier}/device-general`);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" space-y-1 px-2" align="end">
          <DropdownMenuItem onSelect={handleEditPolicy}>
            <PenBoxIcon className="mr-4 size-4" />
            <span>ポリシー詳細</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClick}>
            <Download className="mr-4 size-4" />
            <span>設定をダウンロード</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UploadIcon className="mr-4 size-4" />
            <span>設定をアップロード</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RefreshCw className="mr-4 size-4" />
            <span>Googleサーバーと同期</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
            <Trash2 className="mr-4 size-4" />
            <span className="text-red-500">削除</span>
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
              削除すると、端末には自動で「デフォルトポリシー」が適用されます。
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
