export default function HousePath() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <h1 className="text-2xl font-semibold mb-10">
          A sensible order of things
        </h1>

        <ol className="space-y-10">

          <li>
            <h2 className="font-medium mb-2">
              1. Get a rough sense of what’s affordable
            </h2>
            <p className="text-gray-700">
              This is about understanding a range, not arriving at a precise
              number. The goal is to set boundaries before you get emotionally
              attached to properties.
            </p>
            <p className="text-gray-500 mt-2">
              You don’t need pre-approval yet.
            </p>
          </li>

          <li>
            <h2 className="font-medium mb-2">
              2. Understand the real costs (not just the price)
            </h2>
            <p className="text-gray-700">
              Buying a home involves more than the purchase price. There are
              upfront costs, ongoing costs, and one-off expenses that often
              catch first-time buyers off guard.
            </p>
          </li>

          <li>
            <h2 className="font-medium mb-2">
              3. Narrow what kind of home actually fits you
            </h2>
            <p className="text-gray-700">
              Before you look seriously, it helps to be clear on trade-offs:
              location versus space, house versus apartment, flexibility versus
              certainty.
            </p>
            <p className="text-gray-500 mt-2">
              You don’t need an agent yet.
            </p>
          </li>

        </ol>

        <div className="my-12 border-t border-gray-200"></div>

        <div className="space-y-10 text-gray-600">

          <div>
            <h2 className="font-medium mb-2 text-gray-800">
              4. Get finance confidence
            </h2>
            <p>
              Once the earlier steps feel clear, some people choose to talk to a
              lender or broker to understand what’s realistically available to
              them.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-2 text-gray-800">
              5. Start inspections and offers
            </h2>
            <p>
              This is the phase where things move faster and decisions have
              higher stakes. It’s helpful to reach this point feeling informed
              rather than rushed.
            </p>
          </div>

        </div>

        <div className="mt-14 rounded-md bg-gray-50 p-6 text-gray-700">
          <p className="font-medium mb-2">
            You don’t need to do all of this now.
          </p>
          <p>
            Many people spend time in the early steps, looping back and forth,
            before moving on. That’s normal.
          </p>
        </div>

        <div className="mt-12">
          <a
            href="/house"
            className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-700"
          >
            Return to start
          </a>
        </div>

      </div>
    </main>
  );
}
