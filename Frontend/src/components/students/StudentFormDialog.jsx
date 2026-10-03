import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { classOptions, emptyStudent } from "./studentFields";

const inputClass = "w-full rounded-lg border border-[#dbe4dd] bg-[#f7f8f4] px-3 py-2 text-sm text-[#17324d] outline-none transition focus:border-[#147457]";
const labelClass = "mb-1 block text-xs font-medium text-[#58707b]";

function FieldError({ message }) {
  return message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;
}

export default function StudentFormDialog({ open, onClose, onSubmit, student, busy = false }) {
  const [imagePreview, setImagePreview] = useState("");
  const imagePreviewRef = useRef("");
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: emptyStudent,
  });
  const previousSchool = useWatch({ control, name: "previousSchool" });
  const disability = useWatch({ control, name: "disability" });
  const imageField = register("imageFile", {
    validate: (fileList) => {
      const file = fileList?.[0];
      if (!file) return true;
      if (!file.type.startsWith("image/")) return "Please choose an image file.";
      if (file.size > 5 * 1024 * 1024) return "Image must be smaller than 5 MB.";
      return true;
    },
  });

  useEffect(() => {
    reset({ ...emptyStudent, ...student });
  }, [reset, student, open]);

  useEffect(() => {
    return () => {
      if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    };
  }, []);

  const previewUrl = imagePreview || student?.imageUrl || "";
  const isBusy = busy || isSubmitting;

  const handleImageChange = (event) => {
    imageField.onChange(event);
    const file = event.target.files?.[0];
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
    imagePreviewRef.current = file ? URL.createObjectURL(file) : "";
    setImagePreview(imagePreviewRef.current);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324d]/30 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e1e8e1] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#17324d]">
              {student ? "Edit Student Details" : "Add New Student"}
            </h2>
            <p className="mt-1 text-xs text-[#819098]">Keep the student record complete and up to date.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isBusy} aria-label="Close student form" className="text-[#819098] hover:text-[#17324d] disabled:cursor-not-allowed disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-[7rem_1fr]">
            <div>
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#b8cec0] bg-[#f1f5f0]">
                {previewUrl ? (
                  <img src={previewUrl} alt="Student preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-[#819098]" />
                )}
              </div>
              <label className="mt-2 block cursor-pointer text-center text-xs font-medium text-[#147457] hover:text-[#105d48]">
                Choose image
                <input
                  {...imageField}
                  onChange={handleImageChange}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                />
              </label>
              <FieldError message={errors.imageFile?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Student full name</label>
                <input {...register("name", { required: "Student name is required." })} className={inputClass} placeholder="e.g. Ayesha Khan" />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <label className={labelClass}>Date of birth</label>
                <input {...register("dob", { required: "Date of birth is required." })} type="date" className={inputClass} />
                <FieldError message={errors.dob?.message} />
              </div>
              <div>
                <label className={labelClass}>Class</label>
                <select {...register("class", { required: "Class is required." })} className={inputClass}>
                  <option value="">Choose class</option>
                  {classOptions.map((className) => <option key={className} value={className}>{className}</option>)}
                </select>
                <FieldError message={errors.class?.message} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#147457]">Academic details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Section</label>
                <input {...register("section", { required: "Section is required." })} className={inputClass} placeholder="e.g. A" />
                <FieldError message={errors.section?.message} />
              </div>
              <div>
                <label className={labelClass}>Roll number</label>
                <input {...register("rollNo", { required: "Roll number is required." })} className={inputClass} placeholder="e.g. 12" />
                <FieldError message={errors.rollNo?.message} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select {...register("status")} className={inputClass}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#147457]">Family and contact</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Father name</label>
                <input {...register("fatherName", { required: "Father name is required." })} className={inputClass} placeholder="Father's full name" />
                <FieldError message={errors.fatherName?.message} />
              </div>
              <div>
                <label className={labelClass}>Father phone</label>
                <input {...register("fatherPhone", { required: "Father phone is required.", pattern: { value: /^[+\d][\d\s()-]{7,}$/, message: "Enter a valid phone number." } })} type="tel" className={inputClass} placeholder="+92 300 1234567" />
                <FieldError message={errors.fatherPhone?.message} />
              </div>
              <div>
                <label className={labelClass}>Student phone</label>
                <input {...register("studentPhone", { pattern: { value: /^[+\d][\d\s()-]{7,}$/, message: "Enter a valid phone number." } })} type="tel" className={inputClass} placeholder="Optional" />
                <FieldError message={errors.studentPhone?.message} />
              </div>
              <div>
                <label className={labelClass}>Guardian name</label>
                <input {...register("guardianName")} className={inputClass} placeholder="If different from father" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#147457]">Background and wellbeing</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Attended a previous school?</label>
                <select {...register("previousSchool")} className={inputClass}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {previousSchool === "yes" && (
                <div>
                  <label className={labelClass}>Previous school name</label>
                  <input {...register("previousSchoolName", { required: "Previous school name is required." })} className={inputClass} placeholder="School name" />
                  <FieldError message={errors.previousSchoolName?.message} />
                </div>
              )}
              <div>
                <label className={labelClass}>Any disability?</label>
                <select {...register("disability")} className={inputClass}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {disability === "yes" && (
                <div>
                  <label className={labelClass}>Disability details</label>
                  <input {...register("disabilityDetails", { required: "Please add disability details." })} className={inputClass} placeholder="Please describe" />
                  <FieldError message={errors.disabilityDetails?.message} />
                </div>
              )}
              <div>
                <label className={labelClass}>Religion</label>
                <input {...register("religion")} className={inputClass} placeholder="e.g. Muslim" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Home address</label>
                <textarea {...register("address", { required: "Home address is required." })} rows="2" className={inputClass} placeholder="Complete home address" />
                <FieldError message={errors.address?.message} />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2 border-t border-[#e8eee8] pt-4">
              <button type="button" onClick={onClose} disabled={isBusy} className="rounded-lg border border-[#dbe4dd] px-4 py-2 text-sm font-medium text-[#58707b] hover:bg-[#f7f8f4] disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isBusy} className="rounded-lg bg-[#147457] px-4 py-2 text-sm font-medium text-white hover:bg-[#105d48] disabled:cursor-not-allowed disabled:opacity-60">
                {isBusy ? "Saving..." : student ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
