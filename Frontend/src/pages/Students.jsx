import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { db } from "../firebase/config";

function StudentModal({ open, onClose, onSubmit, defaultValues }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues ?? { name: "", class: "", section: "", rollNo: "", status: "Present" });
  }, [defaultValues, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {defaultValues ? "Edit Student" : "Add Student"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            onClose();
          })}
          className="space-y-3"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Full name"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              {...register("class", { required: true })}
              placeholder="Class"
              className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
            />
            <input
              {...register("section", { required: true })}
              placeholder="Section"
              className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <input
            {...register("rollNo", { required: true })}
            placeholder="Roll No"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
          />
          <select
            {...register("status")}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
          >
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {defaultValues ? "Save Changes" : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAddOrEdit = async (data) => {
    try {
      if (editing) {
        await updateDoc(doc(db, "students", editing.id), data);
        toast.success("Student updated");
      } else {
        await addDoc(collection(db, "students"), { ...data, createdAt: serverTimestamp() });
        toast.success("Student added");
      }
      setEditing(null);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student removed");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Students</h1>
          <p className="text-sm text-slate-500">Manage all enrolled students</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
        className="mb-4 w-72 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 focus:border-blue-600 focus:outline-none"
      />

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Roll No</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No students found.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="text-slate-300">
                <td className="px-4 py-3 font-medium text-slate-200">{s.name}</td>
                <td className="px-4 py-3">{s.class}</td>
                <td className="px-4 py-3">{s.section}</td>
                <td className="px-4 py-3">{s.rollNo}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      s.status === "Present"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(s);
                        setModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-blue-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddOrEdit}
        defaultValues={editing}
      />
    </div>
  );
}
