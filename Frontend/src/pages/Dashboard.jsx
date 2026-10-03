import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Users, GraduationCap, Layers, Wallet } from "lucide-react";
import { db } from "../firebase/config";

const feeTrend = [
  { month: "Apr", amount: 90000 },
  { month: "May", amount: 105000 },
  { month: "Jun", amount: 98000 },
  { month: "Jul", amount: 120000 },
  { month: "Aug", amount: 143000 },
  { month: "Sep", amount: 132000 },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-[#6b7d87]">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-[#17324d]">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0 });

  useEffect(() => {
    async function loadCounts() {
      try {
        const [studentsSnap, teachersSnap, classesSnap] = await Promise.all([
          getCountFromServer(collection(db, "students")),
          getCountFromServer(collection(db, "teachers")),
          getCountFromServer(collection(db, "classes")),
        ]);
        setCounts({
          students: studentsSnap.data().count,
          teachers: teachersSnap.data().count,
          classes: classesSnap.data().count,
        });
      } catch (err) {
        console.error("Failed to load dashboard counts:", err);
      }
    }
    loadCounts();
  }, []);

  const attendanceData = [
    { name: "Present", value: 1148, color: "#22c55e" },
    { name: "Absent", value: 86, color: "#ef4444" },
    { name: "Leave", value: 14, color: "#eab308" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#17324d]">Welcome back, Admin</h1>
        <p className="text-sm text-[#71838b]">Here&apos;s what&apos;s happening at your school today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={counts.students} color="bg-emerald-600" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={counts.teachers} color="bg-purple-600" />
        <StatCard icon={Layers} label="Total Classes" value={counts.classes} color="bg-orange-600" />
        <StatCard icon={Wallet} label="Total Fees Collected" value="Rs. 4,85,000" color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-[#4d6573]">Fee Collection Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={feeTrend}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e1e8e1", borderRadius: 8 }} />
              <Line type="monotone" dataKey="amount" stroke="#147457" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-[#4d6573]">Attendance Rate</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {attendanceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs text-[#6b7d87]">
            {attendanceData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
