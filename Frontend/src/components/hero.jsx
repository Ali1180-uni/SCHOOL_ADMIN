function Hero({ heroData }) {
  return (
    <section
      className="relative flex items-center overflow-hidden bg-linear-to-r from-white via-white to-emerald-100 px-6 py-16 sm:px-10 lg:px-20 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {heroData.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {heroData.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              Get Started
            </button>
            <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex shrink-0 justify-center lg:justify-end">
          <img
            src={heroData.imageUrl}
            alt="Student celebrating graduation"
            className="w-64 sm:w-80 lg:w-105"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;