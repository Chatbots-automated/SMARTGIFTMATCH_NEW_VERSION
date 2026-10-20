-- AI gift profiles + embeddings for the gift finder.
-- Each approved product gets one row, written by /api/cron/sync-gift-profiles (service role).

create extension if not exists vector with schema extensions;

create table if not exists public.product_ai_profiles (
  product_id uuid primary key references public.products(id) on delete cascade,
  profile jsonb not null,
  embedding extensions.vector(1536) not null,
  price_eur numeric(10,2),
  recipient text not null check (recipient in ('human', 'pet')),
  source_hash text not null,
  model text not null,
  updated_at timestamptz not null default now()
);

create index if not exists product_ai_profiles_embedding_idx
  on public.product_ai_profiles using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists product_ai_profiles_recipient_idx
  on public.product_ai_profiles (recipient);

alter table public.product_ai_profiles enable row level security;

-- Profiles describe public products, so anyone may read them. Only the service role writes.
drop policy if exists "Public can read AI profiles" on public.product_ai_profiles;
create policy "Public can read AI profiles"
  on public.product_ai_profiles for select
  to anon, authenticated
  using (true);

-- Nearest-neighbour search inside the hard filters.
create or replace function public.match_gifts(
  query_embedding extensions.vector(1536),
  match_recipient text,
  min_price_eur numeric default null,
  max_price_eur numeric default null,
  match_count int default 60
)
returns table (product_id uuid, similarity float, profile jsonb)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select p.product_id,
         1 - (p.embedding <=> query_embedding) as similarity,
         p.profile
  from public.product_ai_profiles p
  join public.products pr on pr.id = p.product_id
  where pr.status = 'approved'
    and p.recipient = match_recipient
    and (min_price_eur is null or p.price_eur is null or p.price_eur >= min_price_eur)
    and (max_price_eur is null or p.price_eur is null or p.price_eur <= max_price_eur)
  order by p.embedding <=> query_embedding
  limit least(match_count, 200);
$$;

grant execute on function public.match_gifts(extensions.vector, text, numeric, numeric, int) to anon, authenticated;
