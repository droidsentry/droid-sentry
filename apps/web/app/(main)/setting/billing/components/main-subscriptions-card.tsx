"use client";

import { Price, SubscriptionDevice } from "@/lib/types/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { redirectToDeviceSubscriptionCheckout } from "../../actions";
import MainSubscriptionButton from "./main-subscriptions-button";
import { SubscriptionDeviceSchema } from "@/lib/schemas/stripe";

export default function MainSubscriptionsCard({
  url,
  prices,
}: {
  url: string;
  prices: Price[];
}) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<SubscriptionDevice>({
    mode: "onChange",
    resolver: zodResolver(SubscriptionDeviceSchema),
    defaultValues: {
      quantity: 1,
    },
  });
  const lookupKey = prices[0]?.lookupKey;
  if (!lookupKey) return null;
  const handleSubscriptionCheckout = async (data: SubscriptionDevice) => {
    const quantity = data.quantity;
    startTransition(async () => {
      await redirectToDeviceSubscriptionCheckout(
        lookupKey,
        url,
        quantity
      ).catch((error) => {
        toast.error("エラーが発生しました", {
          description: error.message,
        });
      });
    });
  };
  const currentQuantity = form.watch("quantity");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubscriptionCheckout)}>
        {/* <form action={redirectToSubscriptionCheckout.bind(null, lookupKey, url)}> */}
        <Card className="p-2 pt-8 border-blue-500/50 rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-500">ライセンスを購入</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <MainSubscriptionButton isLoading={isLoading} />
            {prices.map((price) => (
              <div
                key={price.lookupKey}
                className="mt-6 flex flex-col items-center space-y-2"
              >
                <div className="flex items-end">
                  <span className="text-5xl font-sans">
                    ¥{(price.amount * currentQuantity).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1 tracking-widest">
                    /月
                  </span>
                </div>
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormControl>
                            <Input
                              type="number"
                              className="w-20 text-end pr-1 font-bold tracking-wider"
                              {...field}
                              autoComplete="off"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(Number(value));
                              }}
                              min={1}
                              max={10000}
                            />
                          </FormControl>
                          <span className="text-muted-foreground text-sm ml-2 tracking-widest">
                            デバイスを購入する
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <div className="my-2 text-sm md:text-base">
              <CardDescription className="text-center py-4">
                下記機能は、初回サインインから30日間無料でご利用いただけます。
              </CardDescription>
              <ul className="inline-flex flex-col gap-2 text-left">
                {billingExplanations.map((explanation, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <CheckIcon className="text-blue-500" />
                    {explanation}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

const billingExplanations = [
  "プロジェクト : 1個",
  "ポリシー : 1個",
  "管理デバイス : 1個",
];
