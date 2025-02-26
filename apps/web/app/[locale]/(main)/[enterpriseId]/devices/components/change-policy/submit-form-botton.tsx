"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSelectPolicy } from "./select-policy-provider";
export default function SubmitFormBotton() {
  const { isPending } = useSelectPolicy();
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ポリシーを変更中...
        </>
      ) : (
        "ポリシーを変更"
      )}
    </Button>
  );
}
