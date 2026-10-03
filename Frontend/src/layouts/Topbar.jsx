import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0B1120] px-6">
      <div className="relative w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-slate-200">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-200">Admin</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
