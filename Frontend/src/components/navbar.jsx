import { useState } from "react";

function Navbar({ Navs }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = Object.entries(Navs);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-20">
        {/* Logo */}
        <div className="text-lg font-bold tracking-tight text-slate-900">
          SMS<span className="text-emerald-600">.</span>
        </div>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map(([key, label]) => (
            <li key={key}>
              <a
                href={`#${key.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
            Admin Login
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`h-0.5 w-6 bg-slate-900 transition ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-slate-900 transition ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-slate-900 transition ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          {navItems.map(([key, label]) => (
            <li key={key}>
              <a
                href={`#${key.toLowerCase()}`}
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <button className="mt-2 w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Admin Login
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;