import type { Metadata } from "next";

import { AppConfig } from "@/app.config";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "./components/footer";
import Header from "./components/header";
import { getBaseURL } from "@/lib/base-url/client";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: AppConfig.title,
    template: `%s | ${AppConfig.title}`,
  },
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
