"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormPolicy } from "@/app/types/policy";
import { RouteParams } from "@/app/types/enterprise";

export default function CreatePolicyButton() {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId as string;
  const router = useRouter();
  const form = useFormContext<FormPolicy>();

  return (
    <Button
      variant="outline"
      className="flex items-center h-8"
      onClick={() => {
        form.reset();
        router.push(`/${enterpriseId}/policies/new/device-general`);
      }}
    >
      <PlusIcon className="mr-2" />
      <span>ポリシーを作成</span>
    </Button>
  );
}
