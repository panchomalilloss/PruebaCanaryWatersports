import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="font-display text-6xl font-semibold text-brand-blue">404</p>
      <h1 className="mt-3 font-display text-4xl uppercase">This page is not on the site</h1>
      <p className="mt-3 text-muted">The address does not match a public Canary Watersports page.</p>
      <Link href="/" className="mt-6 inline-flex w-fit bg-brand-yellow px-5 py-3 font-semibold text-black">
        Back to the harbour
      </Link>
    </main>
  );
}
