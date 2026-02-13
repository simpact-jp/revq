# RevuQ — Googleレビュー依頼カードを無料作成

## Project Overview
- **Name**: RevuQ
- **Goal**: 店舗オーナーがGoogleレビュー依頼カード（QRコード＋短縮URL入りPDF）を無料で作成できるWebサービス
- **Stack**: Hono + TypeScript + Cloudflare Pages + D1 Database + Tailwind CSS

## URLs
- **Production**: https://revuq.pages.dev
- **Sandbox**: https://3000-iowltqx8erevr2msaddoh-82b888ba.sandbox.novita.ai

## Implemented Features

### 画面構成（5画面）
| Path | 画面 | 機能 |
|------|------|------|
| `/` | LP＋作成フロー | ヒーロー、3ステップ説明、テンプレート選択＋リアルタイムプレビュー |
| `/done` | 完了・ダウンロード | 成功メッセージ、短縮URL（コピー付）、実QRコード、PDFダウンロード |
| `/login` | ログイン | メール入力→OTPコード認証（プロトタイプはコード画面表示） |
| `/dashboard` | マイページ | ユーザーのカード一覧、クリック統計、PDF/QR/削除操作 |
| `/admin` | 運営管理 | KPI、ユーザー管理、カード管理、サービス設定 |

### バックエンドAPI
| Method | Path | 機能 |
|--------|------|------|
| `POST` | `/api/auth/send-code` | OTPコード発行（D1保存） |
| `POST` | `/api/auth/verify` | OTP検証→JWT発行→Cookie設定 |
| `GET` | `/api/auth/me` | JWTからログインユーザー取得 |
| `POST` | `/api/auth/logout` | Cookie削除 |
| `POST` | `/api/cards` | カード作成（未ログインOK） |
| `GET` | `/api/cards` | ユーザーのカード一覧 |
| `GET` | `/api/cards/:id` | カード詳細 |
| `GET` | `/api/cards/:id/qr` | QRコードSVG生成 |
| `GET` | `/api/cards/:id/pdf` | PDFダウンロード（日本語フォント対応） |
| `DELETE` | `/api/cards/:id` | カード削除 |
| `GET` | `/r/:code` | 短縮URL→Googleマップ 302リダイレクト＋クリック記録 |
| `GET` | `/api/admin/stats` | 運営統計 |
| `GET` | `/api/admin/users` | ユーザー一覧 |
| `GET` | `/api/admin/cards` | カード一覧 |
| `PUT` | `/api/admin/cards/:id/status` | カード状態変更 |
| `DELETE` | `/api/admin/cards/:id` | カード削除（管理者） |
| `DELETE` | `/api/admin/users/:id` | ユーザー削除 |
| `GET` | `/api/admin/recent-activity` | 直近アクティビティ |

### コア機能
- **QRコード生成**: 純JavaScript実装（依存ライブラリなし）、SVG出力
- **PDF生成**: pdf-lib + fontkit、日本語フォント対応（Noto Sans JP）、テンプレートカラー反映、画像埋め込み対応
- **短縮URL**: `/r/{7文字コード}` → Googleマップへ302リダイレクト
- **クリック計測**: リダイレクト時にUser-Agent/Refererとともに記録
- **認証**: メールOTP→JWT（HMAC-SHA256）→HttpOnly Cookie
- **テンプレート**: 10種類（シンプル、ナチュラル、ラグジュアリー、ポップ、カフェ風、和風、クリーン、ミニマル、ビビッド、写真強調）

## Data Architecture
- **D1 Database**: `revuq-production` (ID: 761a2348-4d33-4cd7-9341-3cd9bae78785)
  - `users`: ユーザー (email, name, plan)
  - `otps`: ワンタイムコード (email, code, expires_at)
  - `cards`: レビューカード (store_name, google_url, short_code, template, image_key)
  - `clicks`: クリック記録 (card_id, user_agent, referer)
- **画像保存**: Base64でD1のimage_keyカラムに保存（R2有効化後に移行推奨）

## Development

```bash
# Local development
npm run build
pm2 start ecosystem.config.cjs

# DB operations
npx wrangler d1 migrations apply revuq-production --local
npx wrangler d1 execute revuq-production --local --file=./seed.sql

# Deploy
npm run build && npx wrangler pages deploy dist --project-name revuq
npx wrangler d1 migrations apply revuq-production --remote
```

## 本番運用への残タスク

### 高優先度
- [ ] メール送信: Resend/SendGrid連携でOTPを実際にメール送信
- [ ] R2有効化: 画像をR2に移行（現在はBase64でD1保存）
- [ ] JWT_SECRET: `wrangler secret put JWT_SECRET`で本番用シークレット設定
- [ ] ADMIN_PASSWORD: `wrangler secret put ADMIN_PASSWORD`で管理者パスワード設定
- [ ] 管理者認証: ADMIN_EMAILS設定を本番メールアドレスに変更

### 中優先度
- [ ] カスタムドメイン: revuq.jp / revuq.link 取得＋設定
- [ ] Tailwind CSS: CDNからPostCSS/CLIに移行
- [ ] エラーハンドリング: グローバルエラーハンドラ追加
- [ ] レート制限: OTP送信に制限追加

### 低優先度
- [ ] 法務ページ: 利用規約、プライバシーポリシー、特定商取引法表記
- [ ] 有料プラン: Stripe連携、カード枚数制限
- [ ] アナリティクス: 日別クリック推移グラフ
- [ ] PWA: オフライン対応

## Deployment
- **Platform**: Cloudflare Pages + D1
- **Status**: ✅ Active (Production)
- **Last Updated**: 2026-02-13
