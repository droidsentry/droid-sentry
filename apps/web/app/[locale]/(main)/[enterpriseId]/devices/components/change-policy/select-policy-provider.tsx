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
  useTransition,
} from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { z } from "zod";
import { changePolicyDevices } from "../../actions/policy";

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
type FormSchemaType = z.infer<typeof FormSchema>;

// const PolicyListSchema = z.object({
//   policyId: z.string(),
//   policyIdentifier: z.string(),
//   policyDisplayName: z.string(),
// });
const PolicyListSchema = z.object({
  policy: z.object({
    policyId: z.string(),
    policyIdentifier: z.string(),
    policyDisplayName: z.string(),
  }),
});
type PolicyListType = z.infer<typeof PolicyListSchema>;

type ContextType = {
  languages: typeof languages;
  policyList: PolicyList[];
  isPending: boolean;
};

const Context = createContext<ContextType>({} as ContextType);

export function SelectPolicyProvider({
  children,
  deviceIdentifiers,
  policyList,
  setIsOpen,
}: {
  children: ReactNode;
  deviceIdentifiers: string[];
  policyList: PolicyList[];
  setIsOpen: (isOpen: boolean) => void;
}) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  // const form = useForm<FormSchemaType>({
  //   resolver: zodResolver(FormSchema),
  // });
  const form = useForm<PolicyListType>({
    resolver: zodResolver(PolicyListSchema),
  });
  const [isPending, startTransition] = useTransition();

  // const handleChangePolicy = (data: FormSchemaType) => {
  //   toast(
  //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //     </pre>
  //   );
  // };
  const handleChangePolicy = async (data: PolicyListType) => {
    console.log(data.policy);
    // toast(
    //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //   </pre>
    // );
    startTransition(async () => {
      await changePolicyDevices(
        enterpriseId,
        deviceIdentifiers,
        data.policy.policyIdentifier
      )
        .then(() => {
          toast.success("ポリシーを変更しました。");
          setIsOpen(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangePolicy)}
        // onClick={() => handleChangePolicy(form.getValues())}
        className="space-y-6"
      >
        <Context.Provider value={{ languages, policyList, isPending }}>
          {children}
        </Context.Provider>
      </form>
    </Form>
  );
}

export const useSelectPolicy = () => useContext(Context);
