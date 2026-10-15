import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ConfirmDialog from "../students/ConfirmDialog";
import { db } from "../../firebase/config";

const inputClass = "w-full rounded-lg border border-[#dbe4dd] bg-[#f7f8f4] px-3 py-2 text-sm text-[#17324d] outline-none transition focus:border-[#147457]";
const labelClass = "mb-1 block text-xs font-medium text-[#58707b]";

function ModuleForm({ definition, record, open, busy, onClose, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const values = Object.fromEntries(definition.fields.map((field) => [field.name, record?.[field.name] ?? ""]));
    reset(values);
  }, [definition.fields, record, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324d]/30 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e1e8e1] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#17324d]">{record ? `Edit ${definition.title}` : `Add ${definition.title}`}</h2>
            <p className="mt-1 text-xs text-[#819098]">{definition.description}</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close form" className="text-[#819098] hover:text-[#17324d] disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {definition.fields.map((field) => (
              <div key={field.name} className={field.name === "description" ? "sm:col-span-2" : ""}>
                <label className={labelClass}>{field.label}</label>
                {field.type === "select" ? (
                  <select {...register(field.name, { required: field.required ? `${field.label} is required.` : false })} className={inputClass}>
                    <option value="">Choose {field.label.toLowerCase()}</option>
                    {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    {...register(field.name, {
                      required: field.required ? `${field.label} is required.` : false,
                      valueAsNumber: field.type === "number",
                    })}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                )}
                {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-[#e8eee8] pt-4">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-[#dbe4dd] px-4 py-2 text-sm font-medium text-[#58707b] hover:bg-[#f7f8f4] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={busy} className="rounded-lg bg-[#147457] px-4 py-2 text-sm font-medium text-white hover:bg-[#105d48] disabled:opacity-60">{busy ? "Saving..." : record ? "Save Changes" : "Add Record"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FirestoreModulePage({ definition }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, definition.collection),
      (snapshot) => setRecords(snapshot.docs.map((record) => ({ id: record.id, ...record.data() }))),
      () => toast.error(`Unable to load ${definition.title.toLowerCase()}.`),
    );
    return unsubscribe;
  }, [definition.collection, definition.title]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return records;
    return records.filter((record) => definition.fields.some(({ name }) => String(record[name] ?? "").toLowerCase().includes(query)));
  }, [definition.fields, records, search]);

  const handleSave = async (data) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, typeof value === "number" && Number.isNaN(value) ? 0 : value]),
    );

    try {
      if (editing) {
        await updateDoc(doc(db, definition.collection, editing.id), cleanedData);
        toast.success(`${definition.title} updated.`);
      } else {
        await addDoc(collection(db, definition.collection), { ...cleanedData, createdAt: serverTimestamp() });
        toast.success(`${definition.title} added.`);
      }
      setEditing(null);
      return true;
    } catch (error) {
      toast.error(`Unable to save ${definition.title.toLowerCase()}.`);
      console.error(`${definition.title} save error:`, error);
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmation) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, definition.collection, confirmation.id));
      toast.success(`${definition.title} record removed.`);
    } catch (error) {
      toast.error(`Unable to delete ${definition.title.toLowerCase()} record.`);
      console.error(`${definition.title} delete error:`, error);
    } finally {
      setDeleting(false);
      setConfirmation(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#17324d]">{definition.title}</h1>
          <p className="text-sm text-[#71838b]">{definition.description}</p>
        </div>
        <button type="button" onClick={() => setEditing({})} className="flex items-center gap-2 rounded-lg bg-[#147457] px-4 py-2 text-sm font-medium text-white hover:bg-[#105d48]"><Plus className="h-4 w-4" /> Add Record</button>
      </div>

      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.title.toLowerCase()}...`} className="mb-4 w-full max-w-md rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-sm text-[#17324d] shadow-sm focus:border-[#147457] focus:outline-none" />

      <div className="overflow-x-auto rounded-xl border border-[#e1e8e1] bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f1f5f0] text-xs uppercase text-[#71838b]">
            <tr>
              {definition.columns.map((column) => <th key={column} className="px-4 py-3">{definition.fields.find((field) => field.name === column)?.label || column}</th>)}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8eee8]">
            {filteredRecords.length === 0 && <tr><td colSpan={definition.columns.length + 1} className="px-4 py-8 text-center text-[#819098]">No records found.</td></tr>}
            {filteredRecords.map((record) => (
              <tr key={record.id} className="text-[#58707b]">
                {definition.columns.map((column) => <td key={column} className="px-4 py-3">{record[column] || "-"}</td>)}
                <td className="px-4 py-3"><div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(record)} aria-label={`Edit ${definition.title} record`} className="text-[#819098] hover:text-[#147457]"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setConfirmation(record)} aria-label={`Delete ${definition.title} record`} className="text-[#819098] hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModuleForm definition={definition} record={editing?.id ? editing : null} open={Boolean(editing)} busy={saving} onClose={() => setEditing(null)} onSubmit={async (data) => { const saved = await handleSave(data); if (saved) setEditing(null); }} />
      <ConfirmDialog open={Boolean(confirmation)} title={`Delete ${definition.title} record?`} message="This record will be permanently removed." confirmLabel="Delete record" danger={true} busy={deleting} onCancel={() => setConfirmation(null)} onConfirm={handleDelete} />
    </div>
  );
}
