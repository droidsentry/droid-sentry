import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import quickStart from "../images/75.png";
import { Card } from "@/components/ui/card";

export default function FreeTrail() {
  return (
    <section className="py-10 bg-muted/50">
      <div className="mx-auto px-4 md:px-6 max-w-full lg:max-w-[1140px] xl:max-w-7xl xl:px-[70px] grid md:grid-cols-2 md:gap-10 items-center">
        <div className="pt-20 text-center md:text-left mb-2 md:mb-14">
          <h2 className="text-[40px]/[46px] font-bold mb-6">
            即日、無料で開始
          </h2>
          <div className="mb-5 text-lg">
            <p className="leading-relaxed">
              デバイス紛失時のセキュリティ対策。効率的なデバイスの資産管理。
              デバイスの一括設定により、ビジネスの効率化を実現します。
              デバイス紛失時のセキュリティ対策。効率的なデバイスの資産管理。
              デバイスの一括設定により、ビジネスの効率化を実現します。
            </p>
          </div>
        </div>
        <div className="aspect-square size-full flex items-center justify-center">
          <div className="aspect-video w-full flex items-center justify-center bg-white rounded-3xl border overflow-hidden">
            <Image
              src={quickStart}
              alt="quick start"
              className="object-cover p-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
//
