export const AppConfig = {
  title: "DroidSentry",
  description: "Androidデバイスを管理する",
  company: "DroidSentry Inc.",
  address: "1234-5678-9012",
  representative: "DroidSentry-Representative",
  department: "DroidSentry-Department",
  email: "sentry@droidsentry.com",
  defaultLocale: "ja",
  locales: ["ja", "en"],
  defaultTheme: "system", // 'light' | 'dark' | 'system'
} as const;

export type Locale = (typeof AppConfig)["locales"][number];
export const defaultLocale: Locale = "ja";
