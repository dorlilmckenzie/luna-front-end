import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link href="/" className="text-sm text-plum-600 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Privacy notice</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft">
        <p>
          Luna is designed to treat menstrual and reproductive health information as sensitive
          personal data. This page explains, in plain language, how your data is used.
        </p>
        <h2 className="text-base font-semibold text-ink">What we store</h2>
        <p>
          Your name, email and date of birth (for your account), and the cycle data you choose to
          log: period dates and flow, symptoms, moods, notes and reminder preferences.
        </p>
        <h2 className="text-base font-semibold text-ink">How it is used</h2>
        <p>
          Solely to provide the app to you: showing your history, calculating statistics and
          generating cycle estimates. Your data is never sold or shared for advertising.
        </p>
        <h2 className="text-base font-semibold text-ink">How it is protected</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Passwords are hashed with bcrypt and never stored in plain text.</li>
          <li>The API requires authentication and only ever returns your own records.</li>
          <li>Period, symptom, mood and note content is kept out of server logs.</li>
          <li>Traffic between the app and the API uses HTTPS in production.</li>
        </ul>
        <h2 className="text-base font-semibold text-ink">Your control</h2>
        <p>
          You can edit or delete any record at any time. Deleting your account from Settings
          permanently removes your profile and all associated cycle data.
        </p>
        <h2 className="text-base font-semibold text-ink">Not medical advice</h2>
        <p>
          Luna is for tracking and informational purposes only. It does not provide a medical
          diagnosis, and its predictions are estimates that must not be relied on as
          contraception. Please consult a healthcare professional about any health concerns.
        </p>
      </div>
    </main>
  );
}
