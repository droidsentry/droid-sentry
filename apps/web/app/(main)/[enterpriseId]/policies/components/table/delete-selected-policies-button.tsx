"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteSelectedPolicies } from "../../actions/delete-policy";
import { usePoliciesTable } from "../policies-table-provider";
import { PolicyTableType } from "@/app/types/policy";

interface DeleteSelectedPoliciesButtonProps<TData extends PolicyTableType> {
  table: Table<TData>;
}

export default function DeleteSelectedPoliciesButton<
  TData extends PolicyTableType,
>({ table }: DeleteSelectedPoliciesButtonProps<TData>) {
  const [isPending, startTransition] = useTransition();
  const { enterpriseId } = usePoliciesTable();

  const handleDeletePolicies = async () => {
    const deletePolicyIdentifierList = table
      .getSelectedRowModel()
      .rows.map((row) => {
        const policyIdentifier = row.original.policyIdentifier;

        if (policyIdentifier === "default") {
          alert(
            "デフォルトポリシーは削除できません。デフォルトポリシー以外を削除します。"
          );
        }
        return row.original.policyIdentifier;
      });
    startTransition(async () => {
      await deleteSelectedPolicies(enterpriseId, deletePolicyIdentifierList)
        .then(() => {
          toast.success("ポリシーを削除しました。");
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          table.resetRowSelection();
        });
    });
  };

  return (
    <Button
      variant="outline"
      className="h-8 px-2 lg:px-3"
      onClick={handleDeletePolicies}
      disabled={isPending}
      size="icon"
    >
      {isPending ? (
        <Loader2Icon className="size-4 w-full animate-spin" />
      ) : (
        <Trash2Icon className="size-4 text-red-500" />
      )}
    </Button>
  );
}
