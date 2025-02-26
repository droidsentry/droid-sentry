// 有効なタブの定義
export const CATEGORIES = [
  //categories
  "hardware",
  "software",
  "application",
  "policy",
  "network",
  "security",
  "log",
] as const;

// タブの型定義
export type CategoryType = (typeof CATEGORIES)[number];

// タブの表示名マッピング
export const CATEGORY_NAMES: Record<CategoryType, string> = {
  hardware: "ハードウェア情報",
  software: "ソフトウェア情報",
  application: "アプリケーションレポート",
  policy: "ポリシー情報",
  network: "ネットワーク情報",
  security: "セキュリティ情報",
  log: "ログ",
};
