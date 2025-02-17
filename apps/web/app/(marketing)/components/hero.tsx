import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import heroImageConsole from "../images/hero-image-console.png";

export default function Hero() {
  return (
    <section className="pt-1.5 pb-28">
      <div className="px-4 md:px-6 xl:px-0 lg:pt-16 pt-5 grid lg:grid-cols-2 items-center">
        <div className="lg:text-left text-center mr-0 md:mr-18">
          <div className="mb-5 text-4xl md:text-6xl font-bold">
            <h1 className="leading-[1.17]">
              シンプルで理想的な
              <br />
              デバイス管理
            </h1>
          </div>
          <div className="mb-5 text-base md:text-lg">
            <p className="leading-relaxed">
              デバイス紛失時のセキュリティ対策。効率的なデバイスの資産管理。
              デバイスの一括設定により、ビジネスの効率化を実現します。
            </p>
          </div>
          <div className="my-8">
            <Button
              className={cn(
                `text-16 rounded-full text-center w-full h-[52px]
              px-6 py-4
              md:w-auto`
              )}
              asChild
            >
              <Link href="/features" replace>
                <span className="text-base">無料アカウントで始める</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image src={heroImageConsole} alt="hero-image-console-ui" />
        </div>
      </div>
    </section>
  );
}
