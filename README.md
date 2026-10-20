# SmartGiftMatch

Gift finder + curated gift catalogue. Next.js 16 (App Router, Cache Components), Tailwind v4, Supabase (same database as the old site, plus pgvector for gift matching), OpenAI for the gift finder.

## Run

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

### Gift finder AI (one-time setup)

1. Run `supabase/migrations/20261018000000_gift_ai_profiles.sql` in the Supabase SQL editor.
2. Set `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` in `.env.local`.
3. Build the gift profiles (re-run any time; only new/changed products are processed):
   `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-gift-profiles`
4. Check quality: `node scripts/eval-finder.mjs` prints what a set of test shoppers would see.

Without an OpenAI key, or before profiles exist, the finder falls back to the built-in scoring engine.

## How it fits together

- `src/lib/data.ts` – all Supabase reads, cached for 1 hour (`"use cache"` + `cacheLife("hours")`). Every product, collection, blog and article page is prerendered as static HTML.
- `src/lib/ai/profile.ts` + `sync.ts` – once per product, GPT writes a structured gift profile (who it suits, interests, realistic occasions, ages, vibe, who it's *not* for) and we store it with an embedding in `product_ai_profiles` (pgvector).
- `src/lib/ai/finder.ts` – search pipeline: embed the recipient → pgvector top 60 within recipient + budget → strict rules (species, age, shipping) → hybrid score + category diversity → one GPT call picks 3 and orders the rest. The model only ever sees ~18 gifts, however big the catalogue gets.
- `src/lib/match.ts` – deterministic fallback scorer used when AI is unavailable.
- `src/app/api/match` – the gift-finder endpoint (validated with zod, lightly rate-limited).
- `src/app/go/[slug]` – outbound affiliate redirect (noindex), one place to add click tracking.
- SEO: per-page metadata + canonicals, `sitemap.xml`, `robots.txt`, OG images, JSON-LD (Organization, WebSite, BreadcrumbList, Product, CollectionPage, BlogPosting, Article, FAQPage). Old URLs are preserved.

Content (products, collections, blogs, articles) is still managed from the old dashboard; this app only reads it.
