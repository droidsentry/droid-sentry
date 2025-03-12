import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import DiscordSingInButton from "../components/discord-sing-in_button";
import { GitHubSignInButton } from "../components/github-login-button";
import GoogleSingInButton from "../components/google-sing-in-button";
import SingleWelcome from "../images/single-welcome.webp";
import { SignInForm } from "./components/sign-in-form";

export default async function Page() {
  return (
    <div className="flex flex-col-reverse lg:flex-row mt-20 sm:mt-10 pb-5 sm:pb-20 md:pb-52 lg:pb-60 xl:pb-10 2XL:pb-0 gap-20 md:gap-10 xl:gap-0">
      <div className="basis-1/3 lg:basis-4/6 flex items-center justify-center pl-8 md:pl-40 xl:pl-20 pr-8">
        <div className="max-w-[600px]">
          <h1 className="text-4xl sm:text-7xl font-semibold leading-normal md:leading-relaxed tracking-wide">
            Android を
            <br />
            しっかり管理する
          </h1>
          <ol className="text-lg list-disc sm:text-2xl pt-10 leading-normal md:leading-relaxed tracking-wide">
            Android端末をしっかり管理することで、以下のような課題を解決できます。
            <li>情報漏洩対策</li>
            <li>端末設定</li>
            <li>アプリ管理</li>
          </ol>
        </div>
      </div>

      <div className="basis-1/3 lg:basis-2/6 flex items-center justify-center pl-2 pr-2 md:pr-20">
        <Image
          src={SingleWelcome}
          alt=""
          width={400}
          height={400}
          className="w-[300px] sm:w-[400px] md:w-[450px] lg:w-auto h-[598px] sm:h-auto xl:h-[550px] animate-[float_3s_ease-in-out_infinite]"
          priority
        />
      </div>

      <div className="basis-1/3 lg:basis-2/6 flex justify-center items-center pl-4 pr-4 lg:pr-10 xl:pr-24 2xl:pr-40">
        <div className="flex flex-col gap-2 w-[300px] sm:w-[400px] md:w-[450px] lg:w-auto xl:w-full">
          <GitHubSignInButton />
          <GoogleSingInButton />
          <DiscordSingInButton />
          <div className="w-full flex items-center gap-4 my-4">
            <div className="flex-grow border-t text-muted-foreground"></div>
            <span className="text-muted-foreground">or</span>
            <div className="flex-grow border-t text-muted-foreground"></div>
          </div>

          <div className="flex-1">
            <SignInForm />
            <div className="pt-4">
              <div className="pl-4 text-xs text-muted-foreground">
                アカウントをお持ちではありませんか？
              </div>
              <Button variant="link" className="relative" asChild>
                <Link
                  href="/sign-up"
                  className="text-xs font-bold absolute top-0 right-0"
                >
                  アカウントを新規作成する
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
