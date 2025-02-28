// import EnMarketingMessages from "./messages/marketing/en.json";
// import JaMarketingMessages from "./messages/marketing/ja.json";
// // import EnAuthMessages from "./messages/auth/en.json";
// // import JaAuthMessages from "./messages/auth/ja.json";
// // import EnMainMessages from "./messages/main/en.json";
// // import JaMainMessages from "./messages/main/ja.json";

// // 英語の型
// type Messages =
//   // typeof EnAuthMessages &
//   //   typeof EnMainMessages &
//   typeof EnMarketingMessages;

// // 日本語の型
// type JaMessages =
//   //  typeof JaAuthMessages &
//   //   typeof JaMainMessages &
//   typeof JaMarketingMessages;

// // 型の互換性チェック
// type ValidateMessages = Messages extends JaMessages
//   ? JaMessages extends Messages
//     ? true
//     : false
//   : false;
// // コンパイル時にエラーを発生させるための型アサーション
// const _check: ValidateMessages = true;

// //　基準の型をJaにする
// // type Messages = JaMessages;
// declare global {
//   // Use type safe message keys with `next-intl`
//   interface IntlMessages extends Messages {}
//   // interface IntlMessages extends JaMessages {}
// }
