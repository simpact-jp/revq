# RevuQ — Googleレビュー依頼カード作成ツール

## Project Overview
- **Name**: RevuQ
- **Goal**: 店舗オーナーがGoogleレビュー依頼カード（QRコード+短縮URL入りPDF）を無料で簡単に作成できるWebツール
- **Platform**: Cloudflare Pages + Hono + D1
- **Status**: Production

## URLs
- **Production**: https://revuq.pages.dev
- **Admin**: https://revuq.pages.dev/admin
- **GitHub**: deployed via Cloudflare Pages

## Features

### 完了済み機能
- **カード作成フロー**: GoogleマップURL入力 → テンプレート選択 → PDF生成・ダウンロード
- **10種テンプレート**: simple, natural, luxury, pop, cafe, japanese, clean, minimal, vivid, photo
- **QRコード生成**: uqr ライブラリ（ECC H: 30%冗長）で高い読み取り精度
- **短縮URLリダイレクト**: `/r/:code` でGoogleマップURLにリダイレクト + クリック計測
- **OTP認証**: メールアドレスでワンタイムパスワード認証（Resend API対応）
  - メール送信サービス設定済み → メールでOTP送信
  - メール未設定（プロトタイプモード） → 画面にコード表示
  - 再送信機能対応
- **PDF印刷レイアウト選択**:
  - A4 1枚拡大（カード1つを大きく印刷）
  - A4 2分割
  - A4 4分割
  - A4 8分割
- **CTA文字編集**: プレビュー画面でカードに表示するメッセージを自由に変更可能（デフォルト：「Googleレビューにご協力ください」）
- **マイページ（Dashboard）**: ログインユーザーのカード管理、PDF各レイアウトでダウンロード
- **運営管理画面（Admin）**:
  - 概要: KPI（ユーザー数、カード数、クリック数、稼働カード、OTP発行数）
  - ユーザー一覧: 登録数、カード数、クリック数、プラン、操作
  - カード一覧: 状態管理（稼働/一時停止）、削除
  - OTP/メールタブ: メール送信設定状態、OTP統計、最近のOTPアクティビティ
  - 設定: サービス設定（トグル）、無料プラン制限

## API Endpoints

### 認証 (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/send-code` | OTPコード送信（email） |
| POST | `/api/auth/verify` | OTP検証・JWT発行（email, code） |
| GET | `/api/auth/me` | 現在のユーザー取得 |
| POST | `/api/auth/logout` | ログアウト |

### カード (`/api/cards`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/cards` | カード作成（google_url, store_name?, template?, image_data?, cta_text?） |
| GET | `/api/cards` | ユーザーのカード一覧 |
| GET | `/api/cards/qr-preview?url=` | URLのQR SVGプレビュー |
| GET | `/api/cards/:id` | カード詳細 |
| PUT | `/api/cards/:id` | カード更新（store_name, cta_text, template） |
| GET | `/api/cards/:id/qr` | QRコードSVG |
| GET | `/api/cards/:id/pdf?layout=&copies=` | PDF生成（layout: card/a4-single/a4-multi, copies: 1-8） |
| DELETE | `/api/cards/:id` | カード削除 |

### 管理 (`/api/admin`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | サービス統計（ユーザー数、カード数、クリック数、OTP数、メール設定状態） |
| GET | `/api/admin/users` | ユーザー一覧 |
| GET | `/api/admin/cards` | カード一覧 |
| GET | `/api/admin/recent-activity` | 最近のアクティビティ（ユーザー、カード、OTP） |
| PUT | `/api/admin/cards/:id/status` | カード状態変更 |
| PUT | `/api/admin/cards/:id` | カード編集 |
| DELETE | `/api/admin/cards/:id` | カード削除 |
| DELETE | `/api/admin/users/:id` | ユーザー削除 |

### 短縮URL
| Method | Path | Description |
|--------|------|-------------|
| GET | `/r/:code` | Googleマップにリダイレクト + クリック計測 |

## Data Architecture
- **D1 Database**: `revuq-production`
  - `users` - ユーザー（email, name, plan）
  - `otps` - ワンタイムパスワード（email, code, expires_at, used）
  - `cards` - レビューカード（store_name, google_url, short_code, template, cta_text）
  - `clicks` - クリック追跡（card_id, user_agent, referer）

## Tech Stack
- **Backend**: Hono (TypeScript)
- **Frontend**: Vanilla JS + Tailwind CSS CDN + FontAwesome
- **QR Code**: uqr (ECC H)
- **PDF**: pdf-lib + @pdf-lib/fontkit + Noto Sans JP
- **Authentication**: OTP email (Resend API) + JWT
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages

## OTPメール設定（本番環境）
Resend APIキーを設定することで、OTPコードがメールで送信されます:
```bash
npx wrangler pages secret put RESEND_API_KEY --project-name revuq
# オプション: 送信元メールアドレスをカスタマイズ
npx wrangler pages secret put OTP_FROM_EMAIL --project-name revuq
```

## Deployment
- **Platform**: Cloudflare Pages
- **Project Name**: revuq
- **Last Updated**: 2026-02-14
