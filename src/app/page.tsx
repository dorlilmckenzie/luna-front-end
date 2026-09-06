import Link from 'next/link';

const features = [
  {
    icon: '🩸',
    title: 'Period tracking',
    body: 'Log start and end dates, flow intensity and notes in seconds. Edit or delete anything later.',
  },
  {
    icon: '🔮',
    title: 'Gentle predictions',
    body: 'See an estimated next period and fertile window based on your own history — always clearly labelled as estimates.',
  },
  {
    icon: '📝',
    title: 'Symptoms & moods',
    body: 'Record cramps, headaches, mood changes and more, with severity and notes, on any date.',
  },
  {
    icon: '📅',
    title: 'Calendar view',
    body: 'A colour-coded calendar shows logged periods, predicted days, fertile window and symptoms at a glance.',
  },
  {
    icon: '📊',
    title: 'Cycle statistics',
    body: 'Average, shortest and longest cycle and period length, plus how many cycles you have tracked.',
  },
  {
    icon: '🔒',
    title: 'Privacy first',
    body: 'Your data is yours. We never sell it, keep health details out of logs, and let you delete everything at any time.',
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-rose-600">Luna</span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-plum-600 hover:bg-plum-50"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <section className="mt-14 text-center sm:mt-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-plum-500">
          Your cycle, gently tracked
        </p>
        <h1 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">
          A calm, private place to understand your menstrual cycle
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
          Luna helps you log periods, symptoms and moods, then turns your history into gentle
          predictions and reminders. Designed for your phone, works everywhere.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="w-full rounded-xl bg-rose-500 px-6 py-3 text-center text-base font-medium text-white hover:bg-rose-600 sm:w-auto"
          >
            Create your free account
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-rose-200 bg-white px-6 py-3 text-center text-base font-medium text-ink hover:bg-rose-50 sm:w-auto"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-rose-100/60"
          >
            <span className="text-2xl" aria-hidden>
              {f.icon}
            </span>
            <h2 className="mt-3 text-base font-semibold text-ink">{f.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl bg-plum-50 p-6 text-center ring-1 ring-plum-200 sm:mt-24">
        <h2 className="text-lg font-semibold text-plum-700">Easy account management</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-plum-700/90">
          Update your details, change your password, configure reminders, or permanently delete
          your account and all associated data — all from one settings page.
        </p>
      </section>

      <footer className="mt-16 border-t border-rose-100 pt-6 text-center text-xs text-ink-faint">
        <p>
          Luna is for tracking and informational purposes only. It does not provide medical
          diagnosis and its predictions must not be used as contraception. Always consult a
          healthcare professional with health concerns.
        </p>
        <p className="mt-2">
          <Link href="/privacy" className="underline hover:text-ink-soft">
            Privacy notice
          </Link>
        </p>
        <p className="mt-4">&copy; {new Date().getFullYear()} Dorlin. All rights reserved.</p>
      </footer>
    </main>
  );
}
