import { AppConfig } from "@/app.config";
import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky top-full pt-[60px] pb-[100px] bg-card">
      <div className="container mx-auto md:px-6 px-4 xl:px-[70px] ">
        <HeaderLogoButton className="h-12" />
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex sm:justify-between mt-[60px]"
          )}
        >
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">製品</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                プラン
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">会社情報</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0">
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/terms">利用規約</Link>
              </Button>
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/privacy">プライバシーポリシー</Link>
              </Button>
              <Button variant="ghost" className="w-fit">
                <Link href="/legal">特定商取引法に基づく表示</Link>
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">リソース</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                ブログ
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">お問い合わせとヘルプ</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                サポートメール
              </Button>
              <Button variant="ghost" className="w-fit">
                ヘルプセンターとよくある質問
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-muted-foreground">&copy; {AppConfig.company}</div>
      </div>
    </footer>
  );
}
