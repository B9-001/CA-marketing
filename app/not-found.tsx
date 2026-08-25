import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center text-white">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-gray-300">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-white hover:bg-accent-600"
      >
        Back to homepage
      </Link>
    </div>
  );
}
