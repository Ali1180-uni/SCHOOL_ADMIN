import { X } from "lucide-react";

const details = [
  ["Date of birth", "dob"],
  ["Class", "class"],
  ["Section", "section"],
  ["Roll number", "rollNo"],
  ["Student phone", "studentPhone"],
  ["Father name", "fatherName"],
  ["Father phone", "fatherPhone"],
  ["Guardian name", "guardianName"],
  ["Previous school", "previousSchoolName"],
  ["Disability", "disabilityDetails"],
  ["Religion", "religion"],
  ["Home address", "address"],
  ["Status", "status"],
];

export default function StudentDetailsDialog({ open, student, onClose }) {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324d]/30 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e1e8e1] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e8eee8] pb-4">
          <div className="flex items-center gap-3">
            {student.imageUrl ? (
              <img src={student.imageUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8eee0] text-sm font-semibold text-[#147457]">
                {student.name?.slice(0, 2).toUpperCase() || "ST"}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-[#17324d]">{student.name}</h2>
              <p className="text-xs text-[#819098]">Saved student details</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close student details" className="text-[#819098] hover:text-[#17324d]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {details.map(([label, key]) => (
            <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
              <p className="text-xs font-medium text-[#819098]">{label}</p>
              <p className="mt-1 rounded-lg border border-[#e8eee8] bg-[#f7f8f4] px-3 py-2 text-sm text-[#17324d]">
                {student[key] || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end border-t border-[#e8eee8] pt-4">
          <button type="button" onClick={onClose} className="rounded-lg bg-[#147457] px-4 py-2 text-sm font-medium text-white hover:bg-[#105d48]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
