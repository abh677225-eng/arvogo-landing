export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-24">
        
        <section className="mb-16">
          <h1 className="text-3xl font-semibold leading-tight mb-4">
            Start with clarity, not guesswork.
          </h1>
          <p className="text-lg text-gray-600">
            Guided starting points for life’s complicated decisions.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-lg font-medium mb-6">
            What do you want to do?
          </h2>

          <ul className="space-y-4 text-lg">
            <li>
              <a
                href="https://house.arvogo.com"
                className="underline underline-offset-4 hover:text-gray-600"
              >
                → Buy your first home
              </a>
            </li>
            <li>
              <a
                href="https://visa.arvogo.com"
                className="underline underline-offset-4 hover:text-gray-600"
              >
                → Apply for a visa
              </a>
            </li>
            <li>
              <a
                href="https://bills.arvogo.com"
                className="underline underline-offset-4 hover:text-gray-600"
              >
                → Understand a utility bill
              </a>
            </li>
            <li>
              <span className="text-gray-400">
                → Change careers or study
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-16 text-gray-700">
          <p className="mb-4">
            Arvogo helps you understand where you are, what usually comes next,
            and what doesn’t apply to you.
          </p>
          <p>
            There are no ads and no upfront paywalls. If you ever choose outside
            help, it’s only after you’re clear on your options.
          </p>
        </section>

        <section className="mb-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-3">This is for people who:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>are facing something new or unfamiliar</li>
              <li>feel stuck at the beginning</li>
              <li>want to understand the process before acting</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">This is not for people who:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>want quick comparisons or rankings</li>
              <li>already know exactly what to do</li>
              <li>want someone else to decide for them</li>
            </ul>
          </div>
        </section>

        <section className="text-gray-700">
          <p>
            The bill explainer is live and helps people make sense of confusing
            electricity and gas statements by explaining them step by step.
          </p>
        </section>

      </div>
    </main>
  );
}
