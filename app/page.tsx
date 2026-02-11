export default function ArvogoHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-4xl px-6 py-28">

        {/* Hero */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm text-indigo-700 mb-6">
            A calmer way to start
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Simplifying life’s complex decisions,
            <br className="hidden md:block" />
            step by step.
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed mb-10">
            Arvogo helps you understand where you are, what usually comes next,
            and what you don’t need to worry about yet.
          </p>

          <p className="text-sm text-slate-500">
            Currently focused on common life decisions in the Australian context.
          </p>
        </div>

        {/* Intents */}
        <div className="grid gap-6 md:grid-cols-2 mb-24">

          <a
            href="/house"
            className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Buying your first home
                </h2>
                <span className="text-indigo-400 group-hover:text-indigo-600">→</span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Get oriented on what usually comes first, what can wait,
                and how to avoid common overwhelm.
              </p>

              <p className="mt-6 text-sm text-indigo-600">
                Explore this path
              </p>
            </div>
          </a>

          <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-8">
            <h2 className="text-xl font-semibold mb-2">
              Applying for a visa
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Understand where to start and how the process usually unfolds.
            </p>
            <p className="mt-6 text-sm text-sky-600">Coming soon</p>
          </div>

        </div>

        <div className="text-center text-slate-500 text-sm">
          No ads. No sign-up. No pressure.
        </div>

      </div>
    </main>
  );
}
