export default function HouseEntry() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">

        <h1 className="text-3xl font-semibold leading-tight mb-6">
          Thinking about buying your first home?
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          This helps you figure out where you are, what usually comes next,
          and what you don’t need to worry about yet.
        </p>

        <a
  href="/house/questions"
  className="inline-block rounded-md bg-gray-900 px-6 py-3 text-white text-base font-medium hover:bg-gray-800"
>
  Help me get oriented
</a>

        <p className="mt-6 text-sm text-gray-500">
          No sign-up. No sales. Just clarity.
        </p>

      </div>
    </main>
  );
}
