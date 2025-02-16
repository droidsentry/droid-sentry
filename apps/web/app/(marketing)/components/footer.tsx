import { AppConfig } from "@/app.config";
import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pt-[60px] pb-[100px] bg-card">
      <div className="mx-auto max-w-full lg:max-w-[1140px] xl:max-w-7xl xl:px-[70px] md:px-6 px-4">
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
                特定商法表示
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">リソース</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                プログ
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
        <Separator className="my-8 bg-muted-foreground" />
        <div className="text-muted-foreground">&copy; {AppConfig.company}</div>
      </div>
    </footer>
  );
}
