export const AppConfig = {
  title: "DroidSentry",
  description: "Androidデバイスを管理する",
  company: "DroidSentry Inc.",
  address: "1234-5678-9012",
  representative: "DroidSentry-Representative",
  department: "DroidSentry-Department",
  email: "sentry@droidsentry.com",
  defaultLocale: "ja",
  locales: [
    {
      id: "en",
      label: "English",
    },
    {
      id: "ja",
      label: "Japanese",
    },
  ],
  defaultTheme: "system", // 'light' | 'dark' | 'system'

  // Please set the features you want to hide to false.
  toolbar: {
    print: true,
    theme: true,
    locale: true,
  },
} as const;
