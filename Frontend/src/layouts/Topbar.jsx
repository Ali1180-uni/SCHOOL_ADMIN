import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e1e8e1] bg-white px-6">
      <div className="relative w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9aa2]" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-lg border border-[#e1e8e1] bg-[#f7f8f4] py-2 pl-9 pr-3 text-sm text-[#17324d] placeholder:text-[#8a9aa2] focus:border-[#147457] focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
          <button className="relative text-[#71838b] hover:text-[#17324d]">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d8eee0] text-sm font-semibold text-[#147457]">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-[#17324d]">Admin</p>
            <p className="text-xs text-[#819098]">Super Admin</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-[#dbe4dd] px-3 py-1.5 text-xs text-[#58707b] hover:bg-[#eef8f2]"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
