"use client";

import { RouteParams } from "@/app/types/enterprise";
import { PolicyList } from "@/app/types/policy";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { z } from "zod";

export const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
});

type ContextType = {
  languages: typeof languages;
  policyList: PolicyList[];
};

const Context = createContext<ContextType>({} as ContextType);

export function SelectPolicyProvider({
  children,
  deviceIdentifiers,
  policyList,
}: {
  children: ReactNode;
  deviceIdentifiers: string[];
  policyList: PolicyList[];
}) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleChangePolicy = (data: z.infer<typeof FormSchema>) => {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangePolicy)}
        className="space-y-6"
      >
        <Context.Provider value={{ languages, policyList }}>
          {children}
        </Context.Provider>
      </form>
    </Form>
  );
}

export const useSelectPolicy = () => useContext(Context);
