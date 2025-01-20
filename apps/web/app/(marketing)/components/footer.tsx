import { AppConfig } from "@/app.config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky top-full">
      <div className="flex flex-col lg:flex-row py-4 items-center justify-center px-4 gap-2">
        <div>
          <a className="text-muted-foreground">&copy; {AppConfig.company}</a>
          <Button variant="ghost" asChild>
            <Link href="/terms">利用規約</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/privacy">プライバシーポリシー</Link>
          </Button>
          <Button variant="ghost">特定商法表示</Button>
          <Button variant="ghost">言語</Button>
        </div>
      </div>
    </footer>
  );
}
