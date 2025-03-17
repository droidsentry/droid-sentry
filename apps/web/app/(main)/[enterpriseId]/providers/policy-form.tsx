"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";

import { RouteParams } from "@/app/types/enterprise";
import { FormPolicy } from "@/app/types/policy";
import { Form } from "@/components/ui/form";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getPolicyData } from "../policies/actions/get-policy";
import { formPolicySchema } from "@/app/schemas/policy";
import { defaultPolicyRequestBody } from "@/data/default-policy-request-body";

export const defaultGeneralConfig: FormPolicy = {
  policyData: defaultPolicyRequestBody,
  policyDisplayName: "", // ポリシー名
};

export function PolicyFormProvider({ children }: { children: ReactNode }) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const policyId = params.policyId ?? "new";

  const key = `/api/policy/${policyId}`;
  const { data } = useSWR<FormPolicy>(
    policyId === "new" ? null : key, // policyIdがnewの場合はnullを返す fetchしない
    () => getPolicyData(enterpriseId, policyId),
    {
      revalidateOnFocus: false, // タブ移動しても関数を実行しない
    }
  );

  const form = useForm<FormPolicy>({
    mode: "onChange",
    resolver: zodResolver(formPolicySchema),
    defaultValues: data || defaultGeneralConfig,
  });

  useEffect(() => {
    // console.log("useEffect");
    // 新規作成の場合の処理
    if (policyId === "new") {
      form.reset(defaultGeneralConfig);
      return;
    }
    // データ取得成功時
    if (data) {
      // console.log("data", data);
      form.reset(data);
    }
  }, [policyId, form, data]);

  return <Form {...form}>{children}</Form>;
}
