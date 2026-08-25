-- CA Marketing — initial schema
-- Tables, indexes, and RLS policies for the public website + admin CRM/CMS.

create extension if not exists "pgcrypto";

-- =========================================================
-- ADMINS
-- =========================================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('admin','superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper: is the current JWT owner an admin? SECURITY DEFINER avoids RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- =========================================================
-- LEADS + CRM
-- =========================================================
create sequence if not exists public.lead_number_seq;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_number text not null unique default ('CA-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.lead_number_seq')::text,5,'0')),
  full_name text not null,
  business_name text,
  email text not null,
  phone text,
  website text,
  industry text,
  business_size text,
  service_needed text,
  main_challenge text,
  desired_outcome text,
  budget text,
  message text,
  source text not null default 'website',
  lead_score int not null default 0 check (lead_score between 0 and 100),
  lead_temperature text not null default 'LOW' check (lead_temperature in ('HOT','WARM','POTENTIAL','LOW')),
  stage text not null default 'NEW' check (stage in ('NEW','CONTACTED','QUALIFIED','DISCOVERY','AUDIT','PROPOSAL','NEGOTIATION','WON','LOST','ONBOARDING','ACTIVE_CLIENT')),
  pipeline_value numeric(12,2),
  assigned_to uuid references public.admins(id) on delete set null,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  webhook_sent_at timestamptz,
  confirmation_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_stage on public.leads(stage);
create index if not exists idx_leads_temperature on public.leads(lead_temperature);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_email on public.leads(email);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  admin_id uuid references public.admins(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_lead_notes_lead_id on public.lead_notes(lead_id);

create table if not exists public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz,
  status text not null default 'pending' check (status in ('pending','completed','cancelled')),
  assigned_to uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_lead_tasks_lead_id on public.lead_tasks(lead_id);
create index if not exists idx_lead_tasks_status on public.lead_tasks(status);

-- =========================================================
-- PORTFOLIO / PROJECTS
-- =========================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client text,
  industry text,
  category text not null check (category in ('Websites','Marketing','Branding','Automation','Campaigns','Strategy')),
  description text,
  challenge text,
  solution text,
  results text,
  cover_image text,
  video_url text,
  external_url text,
  featured boolean not null default false,
  published boolean not null default false,
  is_demo boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_published on public.projects(published);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_slug on public.projects(slug);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  caption text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_project_media_project_id on public.project_media(project_id);

-- =========================================================
-- TESTIMONIALS (created before case_studies for FK)
-- =========================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,
  organization text,
  photo_url text,
  testimonial text not null,
  rating int check (rating between 1 and 5),
  published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_testimonials_published on public.testimonials(published);

-- =========================================================
-- CASE STUDIES
-- =========================================================
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  slug text not null unique,
  client text,
  industry text,
  challenge text,
  strategy text,
  solution text,
  implementation text,
  results text,
  metrics jsonb not null default '[]'::jsonb,
  testimonial_id uuid references public.testimonials(id) on delete set null,
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,
  is_demo boolean not null default true,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_case_studies_published on public.case_studies(published);
create index if not exists idx_case_studies_slug on public.case_studies(slug);

-- =========================================================
-- SERVICES
-- =========================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  icon text,
  features jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_services_published on public.services(published);
create index if not exists idx_services_order on public.services(display_order);

-- =========================================================
-- BLOG / INSIGHTS
-- =========================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category text,
  author text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);

-- =========================================================
-- MEDIA LIBRARY (metadata; binaries live in Supabase Storage)
-- =========================================================
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint not null default 0,
  uploaded_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_media_created_at on public.media(created_at desc);

-- =========================================================
-- ANALYTICS
-- =========================================================
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in (
    'page_view','session_start','cta_click','consultation_started','consultation_submitted',
    'whatsapp_click','portfolio_view','case_study_view','service_view','newsletter_signup'
  )),
  session_id text not null,
  visitor_id text not null,
  page text,
  referrer text,
  device text,
  country text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_analytics_event_name on public.analytics_events(event_name);
create index if not exists idx_analytics_created_at on public.analytics_events(created_at desc);
create index if not exists idx_analytics_session on public.analytics_events(session_id);
create index if not exists idx_analytics_visitor on public.analytics_events(visitor_id);

-- =========================================================
-- SITE SETTINGS (key/value so admin content edits need no migrations)
-- =========================================================
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- NEWSLETTER
-- =========================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- updated_at trigger helper
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['admins','leads','lead_tasks','projects','case_studies','services','testimonials','blog_posts']
  loop
    execute format('drop trigger if exists trg_set_updated_at on public.%I;', t);
    execute format('create trigger trg_set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.admins enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.lead_tasks enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.case_studies enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media enable row level security;
alter table public.analytics_events enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- admins: only admins can read the admin table (self or any admin)
create policy "admins_select_self_or_admin" on public.admins for select
  using (id = auth.uid() or public.is_admin());
create policy "admins_manage_superadmin" on public.admins for all
  using (public.is_admin()) with check (public.is_admin());

-- leads: public can INSERT (consultation form) only. Admins can do everything.
create policy "leads_public_insert" on public.leads for insert
  with check (true);
create policy "leads_admin_all" on public.leads for all
  using (public.is_admin()) with check (public.is_admin());

-- lead_notes / lead_tasks: admin only
create policy "lead_notes_admin_all" on public.lead_notes for all
  using (public.is_admin()) with check (public.is_admin());
create policy "lead_tasks_admin_all" on public.lead_tasks for all
  using (public.is_admin()) with check (public.is_admin());

-- projects: public can read published; admin full access
create policy "projects_public_select_published" on public.projects for select
  using (published = true or public.is_admin());
create policy "projects_admin_write" on public.projects for insert with check (public.is_admin());
create policy "projects_admin_update" on public.projects for update using (public.is_admin()) with check (public.is_admin());
create policy "projects_admin_delete" on public.projects for delete using (public.is_admin());

create policy "project_media_public_select" on public.project_media for select
  using (exists (select 1 from public.projects p where p.id = project_id and (p.published = true or public.is_admin())));
create policy "project_media_admin_write" on public.project_media for insert with check (public.is_admin());
create policy "project_media_admin_update" on public.project_media for update using (public.is_admin()) with check (public.is_admin());
create policy "project_media_admin_delete" on public.project_media for delete using (public.is_admin());

-- case_studies: public read published; admin full
create policy "case_studies_public_select_published" on public.case_studies for select
  using (published = true or public.is_admin());
create policy "case_studies_admin_write" on public.case_studies for insert with check (public.is_admin());
create policy "case_studies_admin_update" on public.case_studies for update using (public.is_admin()) with check (public.is_admin());
create policy "case_studies_admin_delete" on public.case_studies for delete using (public.is_admin());

-- services: public read published; admin full
create policy "services_public_select_published" on public.services for select
  using (published = true or public.is_admin());
create policy "services_admin_write" on public.services for insert with check (public.is_admin());
create policy "services_admin_update" on public.services for update using (public.is_admin()) with check (public.is_admin());
create policy "services_admin_delete" on public.services for delete using (public.is_admin());

-- testimonials: public read published; admin full
create policy "testimonials_public_select_published" on public.testimonials for select
  using (published = true or public.is_admin());
create policy "testimonials_admin_write" on public.testimonials for insert with check (public.is_admin());
create policy "testimonials_admin_update" on public.testimonials for update using (public.is_admin()) with check (public.is_admin());
create policy "testimonials_admin_delete" on public.testimonials for delete using (public.is_admin());

-- blog_posts: public read published; admin full
create policy "blog_posts_public_select_published" on public.blog_posts for select
  using (status = 'published' or public.is_admin());
create policy "blog_posts_admin_write" on public.blog_posts for insert with check (public.is_admin());
create policy "blog_posts_admin_update" on public.blog_posts for update using (public.is_admin()) with check (public.is_admin());
create policy "blog_posts_admin_delete" on public.blog_posts for delete using (public.is_admin());

-- media library: admin only (URLs are surfaced to the public via other published tables)
create policy "media_admin_all" on public.media for all
  using (public.is_admin()) with check (public.is_admin());

-- analytics_events: public can insert (tracking), only admin can read
create policy "analytics_public_insert" on public.analytics_events for insert
  with check (true);
create policy "analytics_admin_select" on public.analytics_events for select
  using (public.is_admin());

-- site_settings: public can read (site content), only admin can write
create policy "site_settings_public_select" on public.site_settings for select
  using (true);
create policy "site_settings_admin_write" on public.site_settings for insert with check (public.is_admin());
create policy "site_settings_admin_update" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
create policy "site_settings_admin_delete" on public.site_settings for delete using (public.is_admin());

-- newsletter_subscribers: public can insert (signup); admin can read/manage
create policy "newsletter_public_insert" on public.newsletter_subscribers for insert
  with check (true);
create policy "newsletter_admin_select" on public.newsletter_subscribers for select
  using (public.is_admin());
create policy "newsletter_admin_update" on public.newsletter_subscribers for update
  using (public.is_admin()) with check (public.is_admin());
create policy "newsletter_admin_delete" on public.newsletter_subscribers for delete
  using (public.is_admin());
