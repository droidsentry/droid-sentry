import type { Metadata } from "next";

import { AppConfig } from "@/app.config";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "./components/footer";
import Header from "./components/header";

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
      <Header />
      <main className="flex-1">{children}</main>
      <div className="fixed bottom-4 right-5 z-50">
        <ModeToggle />
      </div>
      <Footer />
    </>
  );
}
