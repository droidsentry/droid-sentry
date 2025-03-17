"use client";

import { FormPolicy } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

export default function CreateNewPolicyLinkButton({
  enterpriseId,
  name = "ポリシーを作成",
}: {
  enterpriseId: string;
  name?: string;
}) {
  const form = useFormContext<FormPolicy>();

  return (
    <Button
      variant="outline"
      className="h-8"
      onClick={() => {
        form.reset();
      }}
      asChild
    >
      <Link href={`/${enterpriseId}/policies/new/device-general`}>
        <PlusIcon className="mr-2" />
        <span>{name}</span>
      </Link>
    </Button>
  );
}
