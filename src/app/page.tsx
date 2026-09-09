export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/10 px-6 py-5 sm:px-10">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase">Meso Manufacturing</p>
      </header>

      <main className="flex flex-1 items-center px-6 py-24 sm:px-10">
        <div className="max-w-2xl">
          <p className="mb-6 text-sm tracking-[0.16em] uppercase text-black/60">
            Website in progress
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Large-scale composite manufacturing.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-black/70">
            Meso Manufacturing develops large, complex polymer composite parts with measurable
            performance. This is a temporary page while we prepare our website.
          </p>
        </div>
      </main>

      <footer className="border-t border-black/10 px-6 py-5 text-sm text-black/60 sm:px-10">
        © {new Date().getFullYear()} Meso Manufacturing
      </footer>
    </div>
  );
}
