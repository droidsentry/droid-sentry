import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
      {/* <main className="bg-gradient-to-t from-primary/10 to-background"> */}
      {children}
    </main>
  );
}
