import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CalendarClock,
  Wallet,
  ClipboardCheck,
  UserPlus,
  BarChart3,
  Settings,
  School,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/classes", label: "Classes & Sections", icon: Layers },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/timetable", label: "Timetable", icon: CalendarClock },
  { to: "/fees", label: "Fees", icon: Wallet },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admissions", label: "Admissions", icon: UserPlus },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[#e1e8e1] bg-white md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <School className="h-6 w-6 text-emerald-500" />
        <span className="text-sm font-semibold text-[#17324d]">Bright Future School</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#147457] text-white shadow-sm"
                  : "text-[#6b7d87] hover:bg-[#eef8f2] hover:text-[#17324d]"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
