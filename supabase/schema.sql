-- 物件テーブルの作成
-- 物件ごとに「物件名」「家賃（円）」「エリア名」「間取り」と、
-- 登録したユーザー（user_id）を保持する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null,
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- user_idで絞り込むRLSポリシーのパフォーマンスのためインデックスを作成
create index if not exists properties_user_id_idx on public.properties (user_id);

-- Row Level Security（行単位のアクセス制御）を有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ参照できる
create policy "Users can view their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idを設定した物件のみ登録できる
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
