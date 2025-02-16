import type { Metadata } from "next";

import { ModeToggle } from "@/components/mode-toggle";
import Footer from "./components/footer";
import Header from "./components/header";
import { AppConfig } from "@/app.config";
import FreeTrail from "./components/free-trail";

export const metadata: Metadata = {
  title: `${AppConfig.title} | Androidデバイスを管理する`,
  description: AppConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container max-w-full lg:max-w-[1140px] xl:max-w-7xl xl:px-[70px] p-0">
        <Header />
        <main className="flex-1">{children}</main>
        <div className="fixed bottom-4 right-5 z-50">
          <ModeToggle />
        </div>
      </div>
      <FreeTrail />
      <Footer />
    </>
  );
}
