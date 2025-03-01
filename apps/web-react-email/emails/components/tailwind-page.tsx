import { Tailwind, Button, Text } from "@react-email/components";
import * as React from "react";
import { tailwindReactEmailConfig } from "../lib/tailwind-config";

export default function TailwindPage() {
  return (
    <Tailwind config={tailwindReactEmailConfig}>
      <Button
        href="https://example.com"
        className="bg-customBlue px-3 py-2 font-medium leading-4 text-white"
      >
        Click me
      </Button>
      <Button
        href="https://example.com"
        className="bg-blue px-3 py-2 font-medium leading-4 text-white rounded-4xl"
      >
        Click me
      </Button>
      <Button
        href="https://example.com"
        className="bg-blue px-3 py-2 font-medium leading-4 text-white rounded-xl"
      >
        Click me
      </Button>
      <Text className="text-sm font-bold">
        MyEMMをご利用いただきありがとうございます。
      </Text>
      <Text className="text-sm font-bold font-serif">
        MyEMMをご利用いただきありがとうございます。
      </Text>
      <Text className="text-sm font-bold font-sans">
        MyEMMをご利用いただきありがとうございます。
      </Text>
      <div className="w-128 h-144 bg-purple text-white p-4 mt-4">
        これは拡張されたスペーシングを使用した要素です。
      </div>
    </Tailwind>
  );
}
