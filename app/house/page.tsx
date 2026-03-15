export default function HouseEntry() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <div className="space-y-8">

            <h1 className="text-3xl font-semibold leading-tight">
              Thinking about buying a house?
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              This helps you get oriented —
              where you are in the process,
              what usually comes next,
              and what doesn’t need attention yet.
            </p>

            <a
              href="/house/questions"
              className="inline-flex items-center justify-center mt-10 rounded-xl bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Help me get oriented
            </a>

            <p className="text-sm text-slate-500">
              No sign-up. No advice. No pressure.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
