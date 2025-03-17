"use client";

import { Price } from "@/app/types/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";
import { redirectToOptionSubscriptionCheckout } from "../../actions";
import { optionList } from "../data/option-list";
import OptionSubscriptionButton from "./option-subscriptions-button";

export default function OptionSubscriptionsCard({
  prices,
  url,
}: {
  prices: Price[];
  url: string;
}) {
  return (
    <Card className="mt-4 border-blue-600/50 rounded-xl relative">
      <CardHeader className="text-center mt-4 sticky top-0 bg-background border-b xl:border-b-0">
        <CardTitle className="tracking-wide">追加オプション</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 xl:grid-cols-4 gap-4 divide-y-4 xl:divide-y-0 xl:divide-x">
        {optionList.map((item) => {
          const price = prices.find(
            (price) => price.lookupKey === item.lookupKey
          );
          return (
            <form
              action={redirectToOptionSubscriptionCheckout.bind(
                null,
                item.lookupKey,
                url
              )}
              key={item.lookupKey}
              className="pl-5 pr-1 py-6"
            >
              {price && (
                <>
                  <CardTitle className="tracking-wide">{price.name}</CardTitle>
                  <CardDescription className="py-4 whitespace-pre-line">
                    {item.description}
                  </CardDescription>
                  <OptionSubscriptionButton />
                  <div className="mt-6">
                    <span className="text-5xl font-sans">
                      ¥{price.amount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1 tracking-widest">
                      /月
                    </span>
                  </div>
                </>
              )}
              {item.lookupKey === "custom" && (
                <>
                  <CardTitle className="tracking-wide">
                    エンタープライズ
                  </CardTitle>
                  <CardDescription className="py-4 whitespace-pre-line">
                    {item.description}
                  </CardDescription>
                  <Button variant="outline" className="">
                    お問い合わせ
                  </Button>
                  <div className="mt-6">
                    <span className="text-5xl font-sans">カスタム</span>
                    <span className="text-muted-foreground text-sm ml-1 tracking-widest">
                      /月
                    </span>
                  </div>
                </>
              )}
              <div className="mt-6">
                <Separator className="my-4" />
                <ul className="space-y-2 my-4">
                  {item.functionList.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <div className="flex items-center">
                        <div className="flex">
                          <CheckIcon className="text-blue-500 size-4 mr-2" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          );
        })}
      </CardContent>
    </Card>
  );
}
