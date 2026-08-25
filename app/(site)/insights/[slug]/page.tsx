import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { CtaSection } from "@/components/site/cta-section";
import type { BlogPost } from "@/lib/types/database";

export const revalidate = 60;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as BlogPost | null;
}

export async function generateMetadata(
  props: PageProps<"/insights/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { type: "article", images: post.featured_image ? [post.featured_image] : undefined },
  };
}

export default async function InsightPage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.featured_image ? [post.featured_image] : undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="section-y">
        <div className="container-page max-w-3xl">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy">
            <ArrowLeft className="h-4 w-4" /> Back to insights
          </Link>

          {post.category && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent-600">
              {post.category}
            </p>
          )}
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex gap-3 text-sm text-gray-500">
            {post.author && <span>{post.author}</span>}
            {post.published_at && <span>· {formatDate(post.published_at)}</span>}
          </div>

          {post.featured_image && (
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg border border-border">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-slate mt-8 max-w-none whitespace-pre-line leading-relaxed text-gray-700">
            {post.content}
          </div>
        </div>
      </article>

      <CtaSection location="insight_detail" />
    </>
  );
}
