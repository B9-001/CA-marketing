// Hand-written types mirroring supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the Supabase CLI is
// linked to the project for a fully generated, always-accurate version.

export type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DISCOVERY"
  | "AUDIT"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ONBOARDING"
  | "ACTIVE_CLIENT";

export type LeadTemperature = "HOT" | "WARM" | "POTENTIAL" | "LOW";

export type ProjectCategory =
  | "Websites"
  | "Marketing"
  | "Branding"
  | "Automation"
  | "Campaigns"
  | "Strategy";

export type AnalyticsEventName =
  | "page_view"
  | "session_start"
  | "cta_click"
  | "consultation_started"
  | "consultation_submitted"
  | "whatsapp_click"
  | "portfolio_view"
  | "case_study_view"
  | "service_view"
  | "newsletter_signup";

export type Admin = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "superadmin";
  created_at: string;
  updated_at: string;
}

export type Lead = {
  id: string;
  lead_number: string;
  full_name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string | null;
  business_size: string | null;
  service_needed: string | null;
  main_challenge: string | null;
  desired_outcome: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  lead_score: number;
  lead_temperature: LeadTemperature;
  stage: LeadStage;
  pipeline_value: number | null;
  assigned_to: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  webhook_sent_at: string | null;
  confirmation_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadNote = {
  id: string;
  lead_id: string;
  admin_id: string | null;
  note: string;
  created_at: string;
}

export type LeadTask = {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "pending" | "completed" | "cancelled";
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export type Project = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  industry: string | null;
  category: ProjectCategory;
  description: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  cover_image: string | null;
  video_url: string | null;
  external_url: string | null;
  featured: boolean;
  published: boolean;
  is_demo: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectMedia = {
  id: string;
  project_id: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
  display_order: number;
  created_at: string;
}

export type Testimonial = {
  id: string;
  name: string;
  position: string | null;
  organization: string | null;
  photo_url: string | null;
  testimonial: string;
  rating: number | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type CaseStudyMetric = {
  label: string;
  value: string;
}

export type CaseStudy = {
  id: string;
  project_id: string | null;
  title: string;
  slug: string;
  client: string | null;
  industry: string | null;
  challenge: string | null;
  strategy: string | null;
  solution: string | null;
  implementation: string | null;
  results: string | null;
  metrics: CaseStudyMetric[];
  testimonial_id: string | null;
  cover_image: string | null;
  gallery: string[];
  is_demo: boolean;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  icon: string | null;
  features: string[];
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type Media = {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string | null;
  created_at: string;
}

export type AnalyticsEvent = {
  id: string;
  event_name: AnalyticsEventName;
  session_id: string;
  visitor_id: string;
  page: string | null;
  referrer: string | null;
  device: string | null;
  country: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type SiteSettingRow = {
  key: string;
  value: unknown;
  updated_at: string;
}

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

// Minimal Database type so the Supabase client generics compile.
// Table row/insert/update shapes are intentionally loose (Partial<Row> for
// Insert/Update) — replace with generated types for stricter checking.
type Tables<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admins: Tables<Admin>;
      leads: Tables<Lead>;
      lead_notes: Tables<LeadNote>;
      lead_tasks: Tables<LeadTask>;
      projects: Tables<Project>;
      project_media: Tables<ProjectMedia>;
      testimonials: Tables<Testimonial>;
      case_studies: Tables<CaseStudy>;
      services: Tables<Service>;
      blog_posts: Tables<BlogPost>;
      media: Tables<Media>;
      analytics_events: Tables<AnalyticsEvent>;
      site_settings: Tables<SiteSettingRow>;
      newsletter_subscribers: Tables<NewsletterSubscriber>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}
