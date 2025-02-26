# Supabase 環境構築手順

## 1. ローカル環境の準備(pnpm コマンドの場合)

### 1.1. 初期化コマンド

```bash
pnpm dlx supabase init
```

### 1.2. ローカル環境の準備

```bash
pnpm dlx supabase start
```

### 1.3. ローカル環境の確認

```bash
pnpm dlx supabase status
```

### 1.4. ローカル環境の停止

```bash
pnpm dlx supabase stop
```

### 1.5 ローカル環境の再起動

```bash
pnpm dlx supabase stop && pnpm dlx supabase start
```

## 2. ローカル環境のリンク

[Supabase](https://supabase.com/) より新しいプロジェクトを作成し、以下のコマンドでローカル Supabase とリンクします。

```bash
pnpm dlx supabase link
```

## デプロイ

1. [本番環境](https://supabase.com/)でプロジェクト作成する
2. プロジェクト作成したときのパスワードはメモしておく
3. リージョンは、国内向けだったら、日本を作成する
4. マイグレーションの確認
5. ローカル環境のデプロイ
6. 外部サービスでの認証（Github など）は本番用の認証 APP、認証設定を更新する
7. Vercel の環境構築

以下のコマンドで本番環境にデプロイします。  
※ 事前にマイグレーションを忘れないすること。

### マイグレーションの更新とローカル環境のデプロイ

```bash
pnpm supabase:generate-migration <マイグレーションタイトル> # マイグレーションしてない場合
pnpm dlx supabase db push
```

## Supabase 本番環境のリセットと、ローカルの状態をプッシュ

```bash
# 1.バックアップをとる。 必要ないものは残さない。
# pnpm dlx supabase db dump -f backup.sql
# 2..gitignore に[*backup.sql]を設定する
# 3.ローカルのマイグレーションファイルを削除する。
# 4.新しいマイグレーションファイルの作成
pnpm supabase:generate-migration init_db_structure
# 本番環境リセット
pnpm dlx supabase db reset --linked
pnpm dlx supabase db push
```

### ストレージの設定

上記コマンドではストレージの情報は反映されないので、
ローカルの環境を参考にし  
本番環境の管理コンソールからストレージの設定を行います。

### 認証の設定

本番環境の管理コンソールから GitHub 認証の設定を行います。  
また、本番用 GitHub 認証アプリの作成も行います。  
次に、認証設定画面の URL Configuration で本番サイトの URL を設定します。

### Vercel 環境変数の更新

本番環境の管理コンソールから各種 API キーをコピーし、Vercel 本番環境の環境変数に Supabase の「Project URL」「API_key_anon」「API_key_Service」を設定します。

## LIFF 連携

### LIFF 連携の基本の流れ

1. LIFF アプリを作成して、LIFF_ID と CHANNEL_ID を取得。※ [公式ドキュメント](https://developers.line.biz/ja/docs/liff/overview/)を参照
2. ngrok を使用してローカル環境の公開 URL を作成する。※ [公式ドキュメント](https://dashboard.ngrok.com/get-started/setup/nodejs)を参照
   2-1. npm install @ngrok/ngrok  
   2-2. ngrok config add-authtoken $YOUR_AUTHTOKEN ※ アクセストークンは公式ドキュメントを参照
   2-3. pnpm dev
   2-4. pnpm dlx ngrok http 3000
   ⇨ localhost:3000 が公開 URL で確認できる。

3. [.env.local]に LIFF_ID と CHANNEL_ID を保存する。
4. supabase のクライアントにクッキーからトークンを取得し、クライアントにセットする
5. ログインの ServerAction を実装する
   1. [pnpm add jsonwebtoken] をコマンドで実行する
   2. [pnpm install --save @types/jsonwebtoken]をコマンド実行
6. クライアントを実装する

## PlayWrite の環境構築

1. [公式ライブラリ](https://storybook.js.org/docs#install-storybook)をインストールする。
2. 拡張機能を使用して、テストするページの Locator 情報を取得してテストコードを作成する
   - Chrome のデベロッパーツールでも Locator を確認できます。
     - F12 > デベロッパーツール　> 要素　> アクセシビリティ
   1. Microsoft 公式の拡張機能をインストール
   2. サイドバー　> フラスコアイコン
   3. ナビゲーションバー > TOOLS > [Record new] >
3. 簡単なテストを実施する

## Storybook の環境構築

1. 公式ドキュメントをダウンロードする、
2. 管理するコンポートネントのデレクトリを設定する

## 特定のプロジェクトを開くための環境構築

1. [code ~/.zshrc] ファイルを開く
2. [alias pj='cd ~/Projects'] エイリアスの追加
3. [source ~/.zshrc] ターミナル再起動

## Vercelから開発環境に必要な環境変数をDL

```bash
vercel env pull --environment=preview
vercel env pull --environment=development
```
