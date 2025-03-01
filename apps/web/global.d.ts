import EnMarketingMessages from "./messages/marketing/en.json";
import JaMarketingMessages from "./messages/marketing/ja.json";
import EnAuthMessages from "./messages/auth/en.json";
import JaAuthMessages from "./messages/auth/ja.json";
import EnMainMessages from "./messages/main/en.json";
import JaMainMessages from "./messages/main/ja.json";

// 英語の型
type EnMessages = typeof EnAuthMessages &
  typeof EnMainMessages &
  typeof EnMarketingMessages;

// 日本語の型
type JaMessages = typeof JaAuthMessages &
  typeof JaMainMessages &
  typeof JaMarketingMessages;

// 厳密な型チェックと実際の型定義を統合
type StrictEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? keyof T extends keyof U
      ? keyof U extends keyof T
        ? T // 型が一致する場合は型Tを返す
        : never
      : never
    : never
  : never;
declare global {
  // Use type safe message keys with `next-intl`

  // 必須データの欠落のみをチェック. キー構造の不一致,追加のキーの存在はチェックしない。
  // type IntlMessages = EnMessages extends JaMessages ? JaMessages : EnMessages;

  // 型が一致するかどうかをチェック、型が一致していれば、EnMessagesが設定される。
  // 型が一致しない場合は、コンパイルエラーが発生する。
  type IntlMessages = StrictEqual<EnMessages, JaMessages>;
}
