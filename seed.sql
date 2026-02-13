-- RevuQ seed data for development

INSERT OR IGNORE INTO users (id, email, name, plan, created_at, last_login_at) VALUES
  (1, 'tanaka@example.com', '田中 太郎', 'free', '2026-01-15 10:00:00', '2026-02-13 09:00:00'),
  (2, 'suzuki@cafe.jp', '鈴木 花子', 'free', '2026-01-22 14:30:00', '2026-02-12 18:00:00'),
  (3, 'sato@salon.com', '佐藤 美咲', 'free', '2026-01-28 09:15:00', '2026-02-11 11:00:00');

INSERT OR IGNORE INTO cards (id, user_id, store_name, google_url, short_code, template, created_at, status) VALUES
  (1, 2, 'カフェ こもれび', 'https://maps.app.goo.gl/cafe123', 'abc123', 'cafe', '2026-02-10 12:00:00', 'active'),
  (2, 1, '焼肉 大将', 'https://maps.app.goo.gl/yakiniku456', 'def456', 'pop', '2026-02-08 15:30:00', 'active'),
  (3, 3, 'Hair Salon BLOOM', 'https://maps.app.goo.gl/salon789', 'ghi789', 'minimal', '2026-02-05 10:00:00', 'active'),
  (4, 1, '整体院 やすらぎ', 'https://maps.app.goo.gl/seitai012', 'jkl012', 'natural', '2026-02-01 08:45:00', 'active');

-- Sample clicks
INSERT OR IGNORE INTO clicks (card_id, clicked_at) VALUES
  (1, '2026-02-11 10:30:00'), (1, '2026-02-11 14:20:00'), (1, '2026-02-12 09:10:00'),
  (2, '2026-02-09 11:00:00'), (2, '2026-02-09 16:45:00'), (2, '2026-02-10 08:30:00'), (2, '2026-02-10 19:00:00'), (2, '2026-02-11 12:15:00'),
  (3, '2026-02-06 13:00:00'), (3, '2026-02-07 10:30:00'),
  (4, '2026-02-02 09:00:00');
