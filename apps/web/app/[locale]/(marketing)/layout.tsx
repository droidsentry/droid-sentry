import type { Metadata } from "next";

import { AppConfig } from "@/app.config";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "./components/footer";
import Header from "./components/header";
import { getBaseURL } from "@/lib/base-url/client";
import { I18nProviderClient } from "@/locales/client";
import { RouteParams } from "@/app/types/enterprise";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: AppConfig.title,
    template: `%s | ${AppConfig.title}`,
  },
  description: AppConfig.description,
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<RouteParams>;
}>) {
  const { locale } = await params;
  // console.log("locale", locale);
  return (
    <I18nProviderClient locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <div className="fixed bottom-4 right-5 z-50">
        <ModeToggle />
      </div>
      <Footer />
    </I18nProviderClient>
  );
}
