import { Hono } from 'hono'
import type { Bindings } from '../lib/types'

const feedback = new Hono<{ Bindings: Bindings }>()

/**
 * POST /api/feedback
 * Submit negative feedback from a customer
 * Body: { card_id: number, message: string }
 */
feedback.post('/', async (c) => {
  const { card_id, message } = await c.req.json<{ card_id: number; message: string }>()

  if (!card_id || !message || !message.trim()) {
    return c.json({ error: 'カードIDとメッセージは必須です' }, 400)
  }

  if (message.trim().length > 2000) {
    return c.json({ error: 'メッセージは2000文字以内にしてください' }, 400)
  }

  // Verify card exists
  const card = await c.env.DB.prepare('SELECT c.*, u.email as owner_email FROM cards c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?')
    .bind(card_id).first()
  if (!card) {
    return c.json({ error: 'カードが見つかりません' }, 404)
  }

  // Save feedback
  await c.env.DB.prepare('INSERT INTO feedbacks (card_id, message) VALUES (?, ?)')
    .bind(card_id, message.trim()).run()

  // Send email notification to store owner (async, non-blocking)
  if (card.owner_email && c.env.RESEND_API_KEY) {
    c.executionCtx.waitUntil(
      sendFeedbackNotification(
        card.owner_email as string,
        card.store_name as string | null,
        card.label as string | null,
        message.trim(),
        c.env.RESEND_API_KEY,
        c.env.OTP_FROM_EMAIL
      )
    )
  }

  return c.json({ success: true })
})

/**
 * Send feedback notification email via Resend
 */
async function sendFeedbackNotification(
  ownerEmail: string,
  storeName: string | null,
  cardLabel: string | null,
  message: string,
  apiKey: string,
  fromEmail?: string
): Promise<void> {
  const from = fromEmail || 'RevQ <noreply@revq.jp>'
  const displayName = storeName || '(店名未設定)'
  const labelText = cardLabel ? ` (${cardLabel})` : ''

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [ownerEmail],
        subject: `[RevQ] お客様からフィードバックが届きました — ${displayName}`,
        html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:#2563eb;padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">RevQ</h1>
    </div>
    <div style="padding:32px 24px;">
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#92400e;">
          📩 お客様からフィードバックが届きました
        </p>
        <p style="margin:0;font-size:12px;color:#a16207;">
          ${escapeHtml(displayName)}${escapeHtml(labelText)}
        </p>
      </div>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">お客様の声</p>
        <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
      <div style="margin-top:24px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#64748b;">
          管理画面からすべてのフィードバックを確認できます
        </p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:11px;">&copy; 2026 RevQ — Googleレビュー依頼カード作成ツール</p>
    </div>
  </div>
</body>
</html>`,
      }),
    })
  } catch (err) {
    console.error('[Feedback Email] Error:', err)
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default feedback
