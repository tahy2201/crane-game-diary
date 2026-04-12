-- プレイ記録テーブル（サンプル用・シンプル版）
create table plays (
  id         uuid        primary key default gen_random_uuid(),
  memo       text,
  spent      integer     not null,
  result     text        not null check (result in ('got', 'failed')),
  played_at  timestamptz not null default now(),
  created_at timestamptz not null default now()
);
