"use client";

import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
// import { syncPoliciesWithGoogle } from "../data/sync-google-policies";
import { toast } from "sonner";
import { syncPoliciesWithGoogle } from "../data/policy-google";

export default function SyncPoliciesButton({
  enterpriseId,
}: {
  enterpriseId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const handleClick = async () => {
    startTransition(async () => {
      if (enterpriseId) {
        await syncPoliciesWithGoogle(enterpriseId)
          .then(() => {
            toast.success("Googleサーバーと同期しました");
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });
  };
  return (
    <Button
      variant="outline"
      className=" h-8 hidden lg:flex"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 animate-spin" />
          同期中...
        </>
      ) : (
        "Googleサーバーと同期 (リリースする時は削除するボタン)"
      )}
    </Button>
  );
}
