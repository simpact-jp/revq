/**
 * Weekly Report Email — sends QR scan summary to store owners
 * Triggered by Cloudflare Workers Cron Trigger every Monday 00:00 UTC (= 09:00 JST)
 */

type ReportUser = {
  id: number
  email: string
  name: string | null
}

type CardReport = {
  store_name: string | null
  label: string | null
  short_code: string
  week_clicks: number
  total_clicks: number
  feedback_count: number
}

/**
 * Send weekly report emails to all opted-in users
 */
export async function sendWeeklyReports(
  db: D1Database,
  resendApiKey: string | undefined,
  fromEmail: string | undefined
): Promise<{ sent: number; skipped: number; errors: number }> {
  if (!resendApiKey) {
    console.log('[Weekly Report] RESEND_API_KEY not set, skipping')
    return { sent: 0, skipped: 0, errors: 0 }
  }

  const from = fromEmail || 'RevQ <noreply@revq.jp>'
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()

  // Get all users who opted in for weekly emails
  const { results: users } = await db.prepare(
    'SELECT id, email, name FROM users WHERE weekly_email = 1'
  ).all()

  if (!users || users.length === 0) {
    console.log('[Weekly Report] No opted-in users')
    return { sent: 0, skipped: 0, errors: 0 }
  }

  let sent = 0
  let skipped = 0
  let errors = 0

  for (const user of users as ReportUser[]) {
    try {
      // Get card data with weekly clicks
      const { results: cards } = await db.prepare(`
        SELECT
          c.store_name, c.label, c.short_code,
          COUNT(CASE WHEN cl.clicked_at >= ? THEN 1 END) as week_clicks,
          COUNT(cl.id) as total_clicks,
          (SELECT COUNT(*) FROM feedbacks f WHERE f.card_id = c.id) as feedback_count
        FROM cards c
        LEFT JOIN clicks cl ON cl.card_id = c.id
        WHERE c.user_id = ? AND c.status = 'active'
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `).bind(weekAgo, user.id).all()

      if (!cards || cards.length === 0) {
        skipped++
        continue
      }

      const cardReports = cards as unknown as CardReport[]
      const totalWeekClicks = cardReports.reduce((s, c) => s + (c.week_clicks || 0), 0)

      // Generate and send email
      const html = buildWeeklyEmailHtml(user, cardReports, totalWeekClicks)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: `[RevQ] 週間レポート — 今週のQRコード読み取り: ${totalWeekClicks}回`,
          html,
        }),
      })

      if (res.ok) {
        sent++
        console.log(`[Weekly Report] Sent to ${user.email} (${totalWeekClicks} clicks)`)
      } else {
        errors++
        const err = await res.text()
        console.error(`[Weekly Report] Failed for ${user.email}:`, res.status, err)
      }
    } catch (e) {
      errors++
      console.error(`[Weekly Report] Error for ${user.email}:`, e)
    }
  }

  console.log(`[Weekly Report] Done: sent=${sent}, skipped=${skipped}, errors=${errors}`)
  return { sent, skipped, errors }
}

/**
 * Build HTML email for the weekly report
 */
function buildWeeklyEmailHtml(
  user: ReportUser,
  cards: CardReport[],
  totalWeekClicks: number
): string {
  const displayName = user.name || user.email.split('@')[0]

  // Date range for the report
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const fmt = (d: Date) => {
    const jst = new Date(d.getTime() + 9 * 3600 * 1000)
    return `${jst.getMonth() + 1}/${jst.getDate()}`
  }
  const dateRange = `${fmt(weekAgo)} 〜 ${fmt(now)}`

  const cardRows = cards.map(card => {
    const name = card.store_name || '(店名なし)'
    const labelTag = card.label ? ` <span style="color:#92400e;font-size:11px;">(${esc(card.label)})</span>` : ''
    const weekBadge = card.week_clicks > 0
      ? `<span style="color:#059669;font-weight:700;">${card.week_clicks}</span>`
      : `<span style="color:#94a3b8;">0</span>`
    const fbBadge = card.feedback_count > 0
      ? `<span style="background:#fef3c7;color:#92400e;padding:1px 6px;border-radius:8px;font-size:11px;">${card.feedback_count}件</span>`
      : ''

    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;">
          <span style="font-weight:600;color:#1e293b;">${esc(name)}</span>${labelTag}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:20px;">
          ${weekBadge}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b;">
          ${card.total_clicks}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;">
          ${fbBadge}
        </td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 24px;text-align:center;">
      <h1 style="margin:0 0 4px;color:#fff;font-size:22px;font-weight:800;">RevQ 週間レポート</h1>
      <p style="margin:0;color:rgba(255,255,255,0.75);font-size:13px;">${dateRange}</p>
    </div>

    <!-- Greeting -->
    <div style="padding:28px 24px 0;">
      <p style="margin:0 0 20px;color:#475569;font-size:15px;">
        ${esc(displayName)} さん、こんにちは。<br>今週のQRコード読み取り状況をお知らせします。
      </p>

      <!-- Highlight -->
      <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#3b82f6;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">今週の読み取り合計</p>
        <p style="margin:0;color:#1e3a8a;font-size:44px;font-weight:800;line-height:1;">${totalWeekClicks}</p>
        <p style="margin:4px 0 0;color:#3b82f6;font-size:13px;">回</p>
      </div>
    </div>

    <!-- Card Table -->
    <div style="padding:0 24px 24px;">
      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 16px;text-align:left;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">カード</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">今週</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">累計</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">FB</th>
          </tr>
        </thead>
        <tbody>
          ${cardRows}
        </tbody>
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:0 24px 28px;text-align:center;">
      <p style="margin:0 0 12px;color:#64748b;font-size:13px;">詳しい分析は管理画面でご確認いただけます</p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;">&copy; 2026 RevQ — Googleレビュー依頼カード作成ツール</p>
      <p style="margin:0;color:#cbd5e1;font-size:10px;">
        このメールはRevQの週間レポート配信設定に基づいて送信されています。<br>
        配信停止はマイページの設定から行えます。
      </p>
    </div>
  </div>
</body>
</html>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
