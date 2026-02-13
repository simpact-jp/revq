import { Hono } from 'hono'
import { renderer } from './renderer'
import { HomePage } from './pages/home'
import { DonePage } from './pages/done'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/dashboard'
import { AdminPage } from './pages/admin'

const app = new Hono()

app.use(renderer)

// Landing / Creation Flow
app.get('/', (c) => {
  return c.render(<HomePage />, { title: 'RevuQ — Googleレビュー依頼カードを無料作成' })
})

// Completion / Download
app.get('/done', (c) => {
  return c.render(<DonePage />, { title: '作成完了 — RevuQ' })
})

// Login
app.get('/login', (c) => {
  return c.render(<LoginPage />, { title: 'ログイン — RevuQ' })
})

// Dashboard (User)
app.get('/dashboard', (c) => {
  return c.render(<DashboardPage />, { title: 'マイページ — RevuQ' })
})

// Admin (Operator)
app.get('/admin', (c) => {
  return c.render(<AdminPage />, { title: '運営管理 — RevuQ' })
})

export default app
