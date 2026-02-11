export default function HousePosition() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <div className="space-y-8">

            <h1 className="text-2xl font-semibold">
              Here’s how your situation looks right now
            </h1>

            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                You’re at an early exploration stage. You don’t need to rush
                or make big commitments yet.
              </p>
              <p>
                That’s a good place to start.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-6">
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>You don’t need pre-approval yet</li>
                <li>You don’t need an agent yet</li>
                <li>You don’t need to decide today</li>
              </ul>
            </div>

            <a
              href="/house/path"
              className="inline-flex mt-10 rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-500"
            >
              Show me a sensible path
            </a>

          </div>
        </div>

      </div>
    </main>
  );
}
