import { useEffect, useState } from "react";
import { collection, getCountFromServer, onSnapshot } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Database, GraduationCap, Layers, Users, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { seedDemoData } from "../data/demoData";
import { db } from "../firebase/config";

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
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [seeding, setSeeding] = useState(false);

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

  useEffect(() => {
    const unsubscribeFees = onSnapshot(collection(db, "fees"), (snapshot) => {
      setFees(snapshot.docs.map((record) => record.data()));
    });
    const unsubscribeAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      setAttendance(snapshot.docs.map((record) => record.data()));
    });
    return () => {
      unsubscribeFees();
      unsubscribeAttendance();
    };
  }, []);

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const feeTotals = fees.reduce((totals, fee) => {
    if (fee.status === "Pending") return totals;
    totals[fee.month] = (totals[fee.month] || 0) + (Number(fee.amount) || 0);
    return totals;
  }, {});
  const feeTrend = monthOrder.filter((month) => feeTotals[month]).map((month) => ({ month, amount: feeTotals[month] }));
  const attendanceTotals = attendance.reduce((totals, record) => ({
    present: totals.present + (Number(record.present) || 0),
    absent: totals.absent + (Number(record.absent) || 0),
    leave: totals.leave + (Number(record.leave) || 0),
  }), { present: 0, absent: 0, leave: 0 });
  const attendanceData = [
    { name: "Present", value: attendanceTotals.present, color: "#22c55e" },
    { name: "Absent", value: attendanceTotals.absent, color: "#ef4444" },
    { name: "Leave", value: attendanceTotals.leave, color: "#eab308" },
  ];

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      const count = await seedDemoData();
      toast.success(`${count} demo records loaded.`);
    } catch (error) {
      toast.error(error.message || "Unable to load demo data.");
      console.error("Demo data seed error:", error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#17324d]">Welcome back, Admin</h1>
          <p className="text-sm text-[#71838b]">Here&apos;s what&apos;s happening at your school today.</p>
        </div>
        <button type="button" onClick={handleSeedDemoData} disabled={seeding} className="inline-flex items-center gap-2 rounded-lg border border-[#b8cec0] bg-white px-3 py-2 text-xs font-semibold text-[#147457] shadow-sm hover:bg-[#eef8f2] disabled:opacity-60">
          <Database className="h-4 w-4" />
          {seeding ? "Loading demo data..." : "Load demo data"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={counts.students} color="bg-emerald-600" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={counts.teachers} color="bg-purple-600" />
        <StatCard icon={Layers} label="Total Classes" value={counts.classes} color="bg-orange-600" />
        <StatCard icon={Wallet} label="Total Fees Collected" value={`Rs. ${feeTrend.reduce((total, record) => total + record.amount, 0).toLocaleString()}`} color="bg-green-600" />
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
