# CA Marketing — Website, Lead Generation, CRM & Analytics Platform

CA Marketing is a consultancy and digital marketing agency helping SMEs, MSMEs, startups and NGOs
improve their digital presence, generate leads, increase sales and automate business processes.

This repository is a production-ready Next.js application combining:

- A **public marketing website** (services, solutions, portfolio, case studies, insights, contact, consultation)
- A **connected CRM** for consultation leads (scoring, pipeline stages, notes, follow-up tasks)
- An **admin dashboard** (`/admin`) for managing portfolio, case studies, services, testimonials,
  blog posts, media, site content and settings — all backed by real Supabase data
- **First-party analytics** stored in Supabase
- An **n8n webhook integration** for lead automation

---

## 1. Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons |
| Backend | Next.js Route Handlers + Server Actions |
| Database | Supabase Postgres (RLS-protected) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (`media` bucket) |
| Automation | n8n (via outbound webhook) |
| Email | Provider abstraction (`lib/email/provider.ts`), implemented for Resend |
| Charts | Recharts |
| Deployment | Vercel |

---

## 2. Project structure

```
app/
  (site)/            Public website routes + shared layout (header/footer/WhatsApp button)
  admin/
    login/            Public login page (outside the protected layout)
    (dashboard)/       Everything under /admin/* except /admin/login — protected by requireAdmin()
  api/
    track/             Analytics event ingestion
    webhooks/lead/      Consultation intake -> Supabase -> n8n -> email -> CRM task
    admin/media/        Authenticated media upload/delete (Supabase Storage)
  sitemap.ts, robots.ts
components/
  ui/                 Small reusable primitives (button, card, input, ...)
  site/               Public site sections (hero, header, footer, forms, ...)
  admin/               Admin dashboard building blocks (charts, forms, sidebar, ...)
  analytics/           Client-side tracking helpers (page views, event views)
lib/
  supabase/           Browser / server / admin (service-role) Supabase clients + auth guard
  types/database.ts    Hand-written types mirroring the SQL schema
  validation/           Zod schemas
  leads/scoring.ts      Lead scoring algorithm
  email/                 Email provider abstraction + templates
  n8n/webhook.ts         Outbound webhook dispatch to n8n
  admin/queries.ts       Dashboard aggregation queries
  rate-limit.ts           In-memory rate limiter for public API routes
supabase/
  migrations/0001_init.sql   Full schema, indexes, RLS policies
  seed.sql / seed-services.json  Optional starter content
```

---

## 3. Setup instructions

```bash
npm install
cp .env.example .env.local   # then fill in the values (see section 4)
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the dashboard.

---

## 4. Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (or use the Supabase CLI locally).
2. Copy the **Project URL**, **anon/public key**, and **service_role key** from
   Project Settings → API into `.env.local` (see section 5 — never commit these).
3. Run the migration in `supabase/migrations/0001_init.sql` against your project (SQL editor,
   `supabase db push`, or the Supabase MCP `apply_migration` tool). It creates all 14 tables,
   indexes, the `is_admin()` helper, `updated_at` triggers, and Row Level Security policies.
4. Create a public Storage bucket named `media` (Storage → New bucket → Public). All uploads and
   deletes are performed server-side through `/api/admin/media` using the service-role client, so
   no additional Storage RLS policies are required — the API route itself verifies the caller is an
   authenticated admin before touching Storage.
5. Optionally load starter content: run `supabase/seed.sql` in the SQL editor, or POST
   `supabase/seed-services.json` to `/rest/v1/services` with the service-role key.

### Row Level Security model

- **Public (anon) role:** can `SELECT` only published rows (`published = true` / `status = 'published'`)
  on `projects`, `case_studies`, `services`, `testimonials`, `blog_posts`; can `INSERT` into `leads`,
  `analytics_events`, `newsletter_subscribers` (and nothing else); can always read `site_settings`.
- **Admin role:** any authenticated user whose `id` exists in the `admins` table gets full read/write
  access everywhere, enforced by a `SECURITY DEFINER` helper function `public.is_admin()`.
- **Service role** (server-only) bypasses RLS entirely and is used only for: the follow-up task /
  webhook-timestamp update after a lead is created, and Storage uploads — both already gated by
  application-level admin checks.

---

## 5. Environment variables

See `.env.example`. Required:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, NEVER exposed to the browser

N8N_LEAD_WEBHOOK_URL=              # n8n workflow webhook URL (see section 6)
N8N_WEBHOOK_SECRET=                # optional shared secret, sent as X-Webhook-Secret

RESEND_API_KEY=                    # optional — omit to log emails to the console instead of sending
EMAIL_FROM=

NEXT_PUBLIC_SITE_URL=              # used for canonical URLs, sitemap, OG tags
```

`.env.local` is git-ignored. `.env.example` documents every variable without real values.

---

## 6. n8n webhook configuration

1. In n8n, create a workflow starting with a **Webhook** node (POST).
2. Copy its production URL into `N8N_LEAD_WEBHOOK_URL`.
3. (Optional) Add a header-based secret check in n8n and set the same value in `N8N_WEBHOOK_SECRET` —
   the app sends it as `X-Webhook-Secret` on every request.
4. On every consultation submission, `POST /api/webhooks/lead` (the app's own intake endpoint) will,
   after saving the lead to Supabase, forward this payload to your n8n URL:

```json
{
  "lead_id": "...",
  "lead_number": "CA-2026-00001",
  "name": "...",
  "business": "...",
  "email": "...",
  "phone": "...",
  "service": "...",
  "budget": "...",
  "message": "...",
  "lead_score": 82,
  "lead_temperature": "HOT",
  "source": "website"
}
```

5. From there, build whatever n8n automation you need (Slack/email alert to sales, CRM sync,
   WhatsApp notification, etc.). If `N8N_LEAD_WEBHOOK_URL` is unset, the app logs and continues —
   the lead is still saved and the consultation flow still succeeds.

---

## 7. Admin setup

Admin accounts are deliberately **not** self-service signup — they're provisioned directly in Supabase:

1. Create the user: Supabase Dashboard → Authentication → Users → **Add user** (set email + password,
   confirm email), or via the Admin API.
2. Add a matching row to the `admins` table with the **same `id`** as the auth user:

```sql
insert into public.admins (id, email, full_name, role)
values ('<auth-user-uuid>', 'you@example.com', 'Your Name', 'superadmin');
```

3. Sign in at `/admin/login`. Visiting any `/admin/*` route without a session redirects to login;
   having a session but no `admins` row also redirects back with an "not authorized" message.

A working admin account (`belloabuhanifa6@gmail.com`) has already been provisioned on the Supabase
project created for this build — see the setup summary shared separately for the password, and
change it after first login.

---

## 8. Vercel deployment

1. Push this repository to GitHub (already done — see `git remote -v`).
2. Import the repo in Vercel.
3. Add all variables from section 5 as Vercel Environment Variables (Production + Preview).
4. Deploy. Vercel will run `next build` — Server Actions, Route Handlers and the proxy
   (`proxy.ts`, formerly "middleware") all run on Vercel's Node.js runtime automatically.
5. Set `NEXT_PUBLIC_SITE_URL` to your production domain for correct canonical URLs, OG tags and the
   sitemap.

---

## 9. Testing checklist

- [ ] Public navigation works on mobile, tablet, laptop, desktop (`components/site/header.tsx` has a
      dedicated mobile menu; admin has a separate mobile nav in `components/admin/mobile-nav.tsx`)
- [ ] `/consultation` form: validation errors, successful submit, lead appears in `/admin/leads`
      with a computed score/temperature, a `lead_tasks` follow-up row, and a `consultation_submitted`
      analytics event
- [ ] `/contact` form creates a lead via the same pipeline
- [ ] Newsletter signup on `/contact` inserts into `newsletter_subscribers`
- [ ] WhatsApp floating button opens `wa.me` with the configured number/message and fires
      `whatsapp_click`
- [ ] `/admin/login` rejects non-admin accounts; protected routes redirect when signed out
- [ ] Portfolio/case study/service/testimonial/blog CRUD: create, edit, publish toggle, delete
- [ ] Media library: upload, search, preview, copy URL, delete (validates file type/size)
- [ ] `/admin` overview + `/admin/analytics` charts respond to the date range filter and reflect
      real Supabase data (empty states render cleanly with zero data)
- [ ] `npm run build` completes with no type errors
- [ ] RLS: anon key cannot read unpublished content or any `leads`/`analytics_events` rows
      (verify in Supabase's SQL editor via `set role anon;`)

---

## 10. Security checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` only imported in `server-only`-guarded modules, never sent to the
      client bundle
- [x] All public-facing tables protected by RLS; public role can only insert leads/analytics/
      newsletter rows and read published content
- [x] `/api/webhooks/lead` and `/api/track` are rate-limited per IP (`lib/rate-limit.ts`) and
      validate every payload with Zod before touching the database
- [x] Consultation form includes a honeypot field to reduce basic bot spam
- [x] Admin routes protected both by proxy-level session check and a server-side
      `admins` table membership check (`requireAdmin()`)
- [x] Media uploads validate MIME type and size server-side before touching Storage
- [x] No secrets committed — `.env.local` is git-ignored, `.env.example` has placeholders only
- [ ] Production: replace the in-memory rate limiter with a distributed store (e.g. Upstash Redis)
      if deploying across multiple regions/instances
- [ ] Production: rotate the seed admin password immediately after first login

---

## 11. Architecture notes

**Lead pipeline** (`/api/webhooks/lead`): validate (Zod) → score (`lib/leads/scoring.ts`) → insert
into `leads` (public RLS insert policy) → log `consultation_submitted` analytics event → forward to
n8n → send prospect confirmation + internal notification email → create a `lead_tasks` follow-up row
(service-role, since only admins can write `lead_tasks`) → return `lead_id`/`lead_number` to the
client, which renders the success state.

**Lead scoring** implements the requested 5-factor, 100-point model (business fit, problem severity,
budget, urgency, decision-maker access). The consultation form doesn't collect explicit "urgency" or
"decision-maker" fields, so those two factors are inferred from free-text keywords and contact-detail
completeness — see the comments in `lib/leads/scoring.ts` for the exact heuristic and how to tune it.

**Content management**: `services`, `projects`, `case_studies`, `testimonials`, `blog_posts` are all
real Supabase tables with admin CRUD UIs; `site_settings` is a key/value table so hero copy, about
content, statistics, contact details, WhatsApp number and social links can all be edited from
`/admin/content` and `/admin/settings` without a deploy.

**Analytics**: `lib/analytics/track.ts` (client) generates a persistent `visitor_id` (localStorage)
and per-tab `session_id` (sessionStorage), then POSTs to `/api/track`, which enriches the event with
device type and country (from Vercel's `x-vercel-ip-country` header when deployed) and inserts into
`analytics_events`. The admin dashboard aggregates these rows per the selected date range
(`lib/admin/queries.ts`) — documented there as the place to swap in a Postgres RPC/materialized view
if event volume grows large enough that in-app aggregation becomes a bottleneck.

**What's demo vs. real**: this is a genuinely working system, not a mock. Every admin action reads
and writes real Supabase data; there is no hardcoded/fake dashboard content. Portfolio and case
study rows include an `is_demo` flag (defaulted to `true`) specifically so any example content
shown before you've added real client work is clearly labeled as a demo project, per the
"never fabricate client results" requirement.
