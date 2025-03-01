import type { Metadata } from "next";

import { AppConfig } from "@/app.config";
import { ModeToggle } from "@/components/mode-toggle";
import { getBaseURL } from "@/lib/base-url/client";
import Footer from "./components/footer";
import Header from "./components/header";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: AppConfig.title,
    template: `%s | ${AppConfig.title}`,
  },
  description: AppConfig.description,
};

export default async function RootLayout({
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
