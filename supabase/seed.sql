-- Optional starter content so the public site isn't empty on first run.
-- Safe to re-run (uses ON CONFLICT). Demo portfolio/case-study rows are
-- explicitly flagged is_demo = true per the "never fabricate results" rule.

insert into public.services (title, slug, summary, description, icon, features, display_order, published) values
  ('Digital Marketing', 'digital-marketing', 'Social media, advertising, campaigns, SEO and growth strategy.', 'We plan and run the campaigns that put your business in front of the right audience — organic and paid — and tie every activity back to leads and revenue.', 'Megaphone', '["Paid social & search advertising","SEO & content strategy","Campaign planning & reporting"]', 1, true),
  ('Website & Digital Experience', 'website-digital-experience', 'Modern websites and landing pages designed to convert.', 'Fast, mobile-first websites and landing pages built to turn visitors into leads, not just look good.', 'Globe', '["Custom website design & build","Conversion-focused landing pages","Ongoing performance optimization"]', 2, true),
  ('Lead Generation', 'lead-generation', 'Lead capture, funnels, CRM and customer acquisition systems.', 'End-to-end systems for capturing, scoring and following up on leads so fewer prospects fall through the cracks.', 'Users', '["Funnels & lead magnets","CRM setup & lead scoring","Acquisition campaign management"]', 3, true),
  ('AI & Automation', 'ai-automation', 'AI agents, WhatsApp automation, email automation and workflow automation.', 'We connect your tools with n8n and AI so repetitive work — follow-ups, replies, reporting — happens automatically.', 'Bot', '["WhatsApp & email automation","AI-assisted lead qualification","Workflow automation with n8n"]', 4, true),
  ('Branding & Creative', 'branding-creative', 'Brand identity, graphics, content and digital creative.', 'A brand system your business can grow into — visual identity, content and creative assets that stay consistent everywhere.', 'Palette', '["Brand identity & guidelines","Marketing & social creative","Content production"]', 5, true),
  ('Business Consultancy', 'business-consultancy', 'Digital transformation, growth strategy and process improvement.', 'Practical, hands-on consultancy for businesses figuring out what to fix first and how to structure growth.', 'Briefcase', '["Digital transformation roadmaps","Growth strategy","Process & operations improvement"]', 6, true)
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values
  ('hero_headline', '"Turn Your Digital Presence Into a Growth Engine."'),
  ('hero_description', '"CA Marketing helps SMEs, MSMEs and organizations attract more customers, generate quality leads, strengthen their digital presence and automate the processes that keep their businesses growing."'),
  ('hero_cta_primary', '"Book a Consultation"'),
  ('hero_cta_secondary', '"View Our Work"'),
  ('whatsapp_number', '"2348000000000"'),
  ('whatsapp_message', '"Hello CA Marketing, I would like to discuss how you can help my business grow."')
on conflict (key) do nothing;
