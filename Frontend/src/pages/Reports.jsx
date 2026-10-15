import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import { db } from "../firebase/config";

export default function Reports() {
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const unsubscribeFees = onSnapshot(collection(db, "fees"), (snapshot) => {
      setFees(snapshot.docs.map((record) => record.data()));
    }, () => toast.error("Unable to load fee reports."));
    const unsubscribeAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      setAttendance(snapshot.docs.map((record) => record.data()));
    }, () => toast.error("Unable to load attendance reports."));
    return () => {
      unsubscribeFees();
      unsubscribeAttendance();
    };
  }, []);

  const feeSummary = useMemo(() => {
    const totals = new Map();
    fees.forEach(({ month, amount, status }) => {
      if (status === "Pending") return;
      totals.set(month || "Unknown", (totals.get(month || "Unknown") || 0) + (Number(amount) || 0));
    });
    return Array.from(totals, ([month, amount]) => ({ month, amount }));
  }, [fees]);

  const attendanceTotals = useMemo(() => attendance.reduce((totals, record) => ({
    present: totals.present + (Number(record.present) || 0),
    absent: totals.absent + (Number(record.absent) || 0),
    leave: totals.leave + (Number(record.leave) || 0),
  }), { present: 0, absent: 0, leave: 0 }), [attendance]);

  const cards = [
    ["Paid fee records", fees.filter((record) => record.status === "Paid").length],
    ["Fee total", `Rs. ${feeSummary.reduce((sum, record) => sum + record.amount, 0).toLocaleString()}`],
    ["Present entries", attendanceTotals.present],
    ["Absent entries", attendanceTotals.absent],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#17324d]">Reports</h1>
        <p className="text-sm text-[#71838b]">Live summaries from fee and attendance records.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => <div key={label} className="rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-sm"><p className="text-sm text-[#71838b]">{label}</p><p className="mt-2 text-2xl font-semibold text-[#17324d]">{value}</p></div>)}
      </div>
      <div className="rounded-xl border border-[#e1e8e1] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#147457]" /><h2 className="text-sm font-medium text-[#4d6573]">Fee collection by month</h2></div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={feeSummary}><CartesianGrid stroke="#e8eee8" vertical={false} /><XAxis dataKey="month" stroke="#71838b" fontSize={12} /><YAxis stroke="#71838b" fontSize={12} /><Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e1e8e1", borderRadius: 8 }} /><Bar dataKey="amount" fill="#147457" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
