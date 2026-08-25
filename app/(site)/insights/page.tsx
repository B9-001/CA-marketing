import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/site/page-header";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical marketing, technology and automation insights for SMEs, MSMEs and organizations.",
  alternates: { canonical: "/insights" },
};

export const revalidate = 60;

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = (data as BlogPost[]) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Growth ideas worth acting on."
        description="Practical thinking on marketing, technology and automation for SMEs, MSMEs and organizations."
      />

      <section className="section-y">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-gray-500">
              Articles will appear here once published from the admin dashboard.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/insights/${post.slug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <p className="text-xs font-medium uppercase tracking-wide text-accent-600">
                        {post.category}
                      </p>
                    )}
                    <h2 className="mt-2 font-semibold text-navy">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.published_at && (
                      <p className="mt-3 text-xs text-gray-400">{formatDate(post.published_at)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
