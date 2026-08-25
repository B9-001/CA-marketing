export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-navy text-white">
      <div className="container-page py-16 lg:py-20">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wide text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-balance text-lg text-gray-300">{description}</p>
        )}
      </div>
    </section>
  );
}
