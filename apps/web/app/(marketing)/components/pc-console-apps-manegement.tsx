import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PCConsoleAppsFeatureGraphic from "../images/pc-console-apps-manegement.png";

export default function PCConsoleAppsManegement() {
  return (
    <section className="pt-20">
      <div className="md:px-6 xl:px-0 px-4">
        <div className="w-full grid gap-y-8 lg:grid-cols-2 items-center justify-between md:gap-x-6 py-0 ">
          <div className="lg:order-last">
            <Image
              src={PCConsoleAppsFeatureGraphic}
              alt="pc-console-apps-manegement"
            />
          </div>
          <div className="md:pr-16 ">
            <h2 className="text-[25.5px]/[30.6px] md:text-[40px]/[46px] font-bold mb-[8.5px] mb:mb-6">
              会社用のGoogleアカウントでアプリケーション管理
            </h2>
            <ul className="flex flex-col gap-y-4 mt-10">
              <li className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  対象アプリの詳細情報を取得できます。
                </span>
              </li>
              <li className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  個人のGoogleアカウント不要でアプリ配信できます。
                </span>
              </li>
              <li className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  限定公開されたAndroidアプリを配信できます。
                </span>
              </li>
              <li className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  プログレッシブWEBアプリ（PWA）を配信できます。
                </span>
              </li>
            </ul>
            <div className="mt-16">
              <Button
                className={cn(
                  `text-16 rounded-full text-center w-full h-[52px]
              px-6 py-4
              md:w-auto`
                )}
                asChild
              >
                <Link href="/features" replace>
                  <span className="text-base">もっと詳しく確認する</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
