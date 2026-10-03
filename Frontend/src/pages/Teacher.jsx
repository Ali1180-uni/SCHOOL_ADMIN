import { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/students/ConfirmDialog";
import StudentDetailsDialog from "../components/students/StudentDetailsDialog";
import StudentFormDialog from "../components/students/StudentFormDialog";
import { db, storage } from "../firebase/config";

async function uploadStudentImage(studentId, file) {
  const safeName = file.name.replace(/[^a-z0-9.-]/gi, "-");
  const imagePath = `students/${studentId}/${Date.now()}-${safeName}`;
  const imageRef = ref(storage, imagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(imageRef, file);
    const timeout = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("Image upload timed out. Check that Firebase Storage is enabled."));
    }, 15000);

    uploadTask.on(
      "state_changed",
      undefined,
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
      async () => {
        clearTimeout(timeout);
        try {
          resolve({ imagePath, imageUrl: await getDownloadURL(imageRef) });
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}

function getSaveErrorMessage(error) {
  if (error.message?.includes("timed out") || error.code === "storage/retry-limit-exceeded") {
    return "Image upload timed out. Enable Firebase Storage for this project.";
  }
  if (error.code === "storage/unauthorized") {
    return "Firebase Storage rules do not allow this upload.";
  }
  return "Unable to save student details.";
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [search, setSearch] = useState("");
  const savingRef = useRef(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "students"),
      (snap) => setStudents(snap.docs.map((student) => ({ id: student.id, ...student.data() }))),
      () => toast.error("Unable to load students"),
    );
    return unsub;
  }, []);

  const handleSave = async (data) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    const { imageFile, ...studentData } = data;
    studentData.previousSchoolName = data.previousSchool === "yes"
      ? data.previousSchoolName
      : "No previous school";
    studentData.disabilityDetails = data.disability === "yes"
      ? data.disabilityDetails
      : "None";
    const selectedFile = imageFile?.[0];
    let uploadedImagePath;

    try {
      const studentRef = editing
        ? doc(db, "students", editing.id)
        : doc(collection(db, "students"));
      let imageData = null;

      if (selectedFile) {
        imageData = await uploadStudentImage(studentRef.id, selectedFile);
        uploadedImagePath = imageData.imagePath;
      }

      const record = { ...studentData, ...(imageData ?? {}) };
      if (editing) {
        await updateDoc(studentRef, record);
      } else {
        await setDoc(studentRef, {
          ...record,
          createdAt: serverTimestamp(),
        });
      }

      if (editing?.imagePath && imageData && editing.imagePath !== imageData.imagePath) {
        await deleteObject(ref(storage, editing.imagePath)).catch(() => undefined);
      }

      toast.success(editing ? "Student updated" : "Student added");
      setEditing(null);
      setModalOpen(false);
    } catch (error) {
      if (uploadedImagePath) {
        await deleteObject(ref(storage, uploadedImagePath)).catch(() => undefined);
      }
      toast.error(getSaveErrorMessage(error));
      console.error("Student save error:", error);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const confirmAction = async () => {
    if (!confirmation) return;

    if (confirmation.type === "edit") {
      setEditing(confirmation.student);
      setModalOpen(true);
      setConfirmation(null);
      return;
    }

    setActionBusy(true);
    try {
      await deleteDoc(doc(db, "students", confirmation.student.id));
      if (confirmation.student.imagePath) {
        await deleteObject(ref(storage, confirmation.student.imagePath)).catch(() => undefined);
      }
      toast.success("Student removed");
    } catch (error) {
      toast.error("Unable to delete student");
      console.error("Student delete error:", error);
    } finally {
      setActionBusy(false);
      setConfirmation(null);
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase().trim();
    return [student.name, student.class, student.rollNo, student.fatherName]
      .some((value) => value?.toLowerCase().includes(query));
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#17324d]">Students</h1>
          <p className="text-sm text-[#71838b]">Manage complete student records</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#147457] px-4 py-2 text-sm font-medium text-white hover:bg-[#105d48]"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search name, class, roll no, or father..."
        className="mb-4 w-full max-w-md rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-sm text-[#17324d] shadow-sm focus:border-[#147457] focus:outline-none"
      />

      <div className="overflow-x-auto rounded-xl border border-[#e1e8e1] bg-white shadow-sm">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-[#f1f5f0] text-xs uppercase text-[#71838b]">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Father</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8eee8]">
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#819098]">No students found.</td>
              </tr>
            )}
            {filteredStudents.map((student) => (
              <tr key={student.id} className="text-[#58707b]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {student.imageUrl ? (
                      <img src={student.imageUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8eee0] text-xs font-semibold text-[#147457]">
                        {student.name?.slice(0, 2).toUpperCase() || "ST"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#17324d]">{student.name}</p>
                      <p className="text-xs text-[#819098]">Roll no. {student.rollNo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{student.class}</td>
                <td className="px-4 py-3">{student.section}</td>
                <td className="px-4 py-3">{student.fatherName || "-"}</td>
                <td className="px-4 py-3">{student.fatherPhone || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${student.status === "Present" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-600"}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setViewing(student)}
                      aria-label={`View ${student.name}`}
                      className="text-[#819098] hover:text-[#147457]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmation({ type: "edit", student })}
                      aria-label={`Edit ${student.name}`}
                      className="text-[#819098] hover:text-[#147457]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmation({ type: "delete", student })}
                      aria-label={`Delete ${student.name}`}
                      className="text-[#819098] hover:text-red-500"
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

      <StudentFormDialog
        key={`${editing?.id ?? "new"}-${modalOpen}`}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        student={editing}
        busy={saving}
      />

      <StudentDetailsDialog
        open={Boolean(viewing)}
        student={viewing}
        onClose={() => setViewing(null)}
      />

      <ConfirmDialog
        open={Boolean(confirmation)}
        title={confirmation?.type === "delete" ? "Delete student record?" : "Edit student record?"}
        message={confirmation?.type === "delete" ? `This will permanently remove ${confirmation.student.name}'s record.` : `Open ${confirmation?.student.name}'s details for editing?`}
        confirmLabel={confirmation?.type === "delete" ? "Delete record" : "Continue to edit"}
        danger={confirmation?.type === "delete"}
        busy={actionBusy}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
