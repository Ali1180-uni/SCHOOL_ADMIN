import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";

export const demoCollections = {
  students: {
    "demo-student-001": {
      name: "Ayesha Khan",
      dob: "2013-04-18",
      class: "6",
      section: "A",
      rollNo: "601",
      studentPhone: "+92 300 1112233",
      guardianName: "Muhammad Khan",
      fatherName: "Muhammad Khan",
      fatherPhone: "+92 300 1112233",
      previousSchool: "yes",
      previousSchoolName: "Green Valley School",
      disability: "no",
      disabilityDetails: "None",
      address: "14 Model Town, Lahore",
      religion: "Muslim",
      status: "Present",
      imageUrl: "",
      imagePublicId: "",
    },
  },
  teachers: {
    "demo-teacher-001": { name: "Sara Ahmed", subject: "Mathematics", phone: "+92 301 2223344", email: "sara.ahmed@brightfuture.edu" },
  },
  classes: {
    "demo-class-001": { name: "6", section: "A", room: "204", capacity: 30 },
  },
  subjects: {
    "demo-subject-001": { name: "Mathematics", class: "6", teacher: "Sara Ahmed" },
  },
  timetable: {
    "demo-timetable-001": { day: "Monday", time: "08:00 - 08:45", class: "6-A", subject: "Mathematics", room: "204" },
  },
  fees: {
    "demo-fee-001": { studentName: "Ayesha Khan", month: "Apr", amount: 25000, status: "Paid" },
    "demo-fee-002": { studentName: "Ayesha Khan", month: "May", amount: 25000, status: "Paid" },
    "demo-fee-003": { studentName: "Ayesha Khan", month: "Jun", amount: 25000, status: "Partial" },
  },
  attendance: {
    "demo-attendance-001": { date: "2026-04-01", class: "6-A", present: 28, absent: 1, leave: 1 },
    "demo-attendance-002": { date: "2026-04-02", class: "6-A", present: 27, absent: 2, leave: 1 },
  },
  admissions: {
    "demo-admission-001": { studentName: "Hamza Ali", guardianName: "Imran Ali", class: "6", phone: "+92 302 3334455", status: "In Review" },
  },
  settings: {
    "demo-setting-school-phone": { key: "school_phone", value: "+92 42 5550100", description: "Main school contact number" },
    "demo-setting-school-email": { key: "school_email", value: "office@brightfuture.edu", description: "Main school email address" },
  },
};

export async function seedDemoData() {
  const batch = writeBatch(db);
  let recordCount = 0;

  Object.entries(demoCollections).forEach(([collectionName, records]) => {
    Object.entries(records).forEach(([recordId, data]) => {
      batch.set(doc(db, collectionName, recordId), {
        ...data,
        demoRecord: true,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      recordCount += 1;
    });
  });

  await batch.commit();
  return recordCount;
}
