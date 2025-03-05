// ドラッグ&ドロップで使用する制限タイプ
const RESTRICTED_APP_KEYS = ["availableApps", "restrictedApps"] as const;
export type RestrictedAppKey = (typeof RESTRICTED_APP_KEYS)[number];
export type RestrictedAppPackages = {
  [K in RestrictedAppKey]: string[];
};
