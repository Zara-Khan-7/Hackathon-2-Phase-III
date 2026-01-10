import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <main className="flex flex-col items-center text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Todo App
        </h1>
        <p className="mt-4 max-w-md text-lg text-gray-600">
          A simple and secure task management application.
          Sign up or log in to start managing your tasks.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
