import { Hono } from 'hono'
import { renderer } from './renderer'
import { HomePage } from './pages/home'
import { DonePage } from './pages/done'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/dashboard'

const app = new Hono()

app.use(renderer)

// Landing / Creation Flow
app.get('/', (c) => {
  return c.render(<HomePage />, { title: 'Googleレビュー依頼カードを無料で作成' })
})

// Completion / Download
app.get('/done', (c) => {
  return c.render(<DonePage />, { title: '作成完了 — Googleレビュー無料作成ツール' })
})

// Login
app.get('/login', (c) => {
  return c.render(<LoginPage />, { title: 'ログイン — Googleレビュー無料作成ツール' })
})

// Dashboard
app.get('/dashboard', (c) => {
  return c.render(<DashboardPage />, { title: '管理画面 — Googleレビュー無料作成ツール' })
})

export default app
