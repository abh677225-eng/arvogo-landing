export default function HousePosition() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <h1 className="text-2xl font-semibold mb-8">
          Here’s how your situation looks right now
        </h1>

        <div className="space-y-6 text-gray-700">
          <p>
            Based on what you’ve told me, you’re at an early exploration stage.
            You’re thinking about buying a home, but you don’t need to rush or
            make big commitments yet.
          </p>

          <p>
            That’s a normal place to be — and it’s actually a good place to
            start.
          </p>
        </div>

        <div className="mt-10 rounded-md bg-gray-50 p-6 text-gray-700">
          <p className="font-medium mb-3">
            What this means for now:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>You don’t need pre-approval yet</li>
            <li>You don’t need to talk to an agent yet</li>
            <li>You don’t need to make any decisions today</li>
          </ul>
        </div>

        <div className="mt-10 space-y-6 text-gray-700">
          <p>
            The most useful thing you can do next is understand the usual order
            of things — what typically comes first, what can wait, and what
            doesn’t apply to you yet.
          </p>
        </div>

        <a
          href="/house/path"
          className="inline-block mt-12 rounded-md bg-gray-900 px-6 py-3 text-white text-base font-medium hover:bg-gray-800"
        >
          Show me a sensible path from here
        </a>

      </div>
    </main>
  );
}
