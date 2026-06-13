import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" className="bg-background">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-extrabold text-dark-orange">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-gray-dark">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-gray-light">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-dark-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-red"
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}
