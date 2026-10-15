# School Management System Data Model

All records are stored in Firebase Firestore. Collection names are shown in parentheses.

## Student (`students`)

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Student full name |
| `imageUrl` | string | Cloudinary secure image URL; empty until an image is uploaded |
| `imagePublicId` | string | Cloudinary public ID |
| `dob` | string | Date of birth in `YYYY-MM-DD` format |
| `class` | string | Pre-Nursery, Nursery, Prep, or class 1-10 |
| `section` | string | Class section |
| `rollNo` | string | Student roll number |
| `studentPhone` | string | Student phone number |
| `guardianName` | string | Guardian name when different from father |
| `fatherName` | string | Father name |
| `fatherPhone` | string | Father phone number |
| `previousSchool` | string | `yes` or `no` |
| `previousSchoolName` | string | Previous school name or `No previous school` |
| `disability` | string | `yes` or `no` |
| `disabilityDetails` | string | Details or `None` |
| `address` | string | Home address |
| `religion` | string | Religion |
| `status` | string | `Present` or `Absent` |
| `createdAt` | timestamp | Creation timestamp |

## Teacher (`teachers`)

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Teacher full name |
| `subject` | string | Primary subject |
| `phone` | string | Contact phone |
| `email` | string | Contact email |
| `createdAt` | timestamp | Creation timestamp |

## Class (`classes`)

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Class name or number |
| `section` | string | Section name |
| `room` | string | Room number |
| `capacity` | number | Maximum students |
| `createdAt` | timestamp | Creation timestamp |

## Subject (`subjects`)

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Subject name |
| `class` | string | Assigned class |
| `teacher` | string | Assigned teacher |
| `createdAt` | timestamp | Creation timestamp |

## Timetable (`timetable`)

| Field | Type | Description |
| --- | --- | --- |
| `day` | string | School day |
| `time` | string | Period time range |
| `class` | string | Class and section |
| `subject` | string | Scheduled subject |
| `room` | string | Room number |
| `createdAt` | timestamp | Creation timestamp |

## Fee (`fees`)

| Field | Type | Description |
| --- | --- | --- |
| `studentName` | string | Student being billed |
| `month` | string | Month abbreviation |
| `amount` | number | Fee amount |
| `status` | string | `Paid`, `Pending`, or `Partial` |
| `createdAt` | timestamp | Creation timestamp |

## Attendance (`attendance`)

| Field | Type | Description |
| --- | --- | --- |
| `date` | string | Attendance date in `YYYY-MM-DD` format |
| `class` | string | Class and section |
| `present` | number | Present count |
| `absent` | number | Absent count |
| `leave` | number | Leave count |
| `createdAt` | timestamp | Creation timestamp |

## Admission (`admissions`)

| Field | Type | Description |
| --- | --- | --- |
| `studentName` | string | Applicant name |
| `guardianName` | string | Applicant guardian |
| `class` | string | Applying class |
| `phone` | string | Guardian phone |
| `status` | string | `New`, `In Review`, `Accepted`, or `Rejected` |
| `createdAt` | timestamp | Creation timestamp |

## Setting (`settings`)

| Field | Type | Description |
| --- | --- | --- |
| `key` | string | Unique setting key |
| `value` | string | Setting value |
| `description` | string | Setting purpose |
| `updatedAt` | timestamp | Last update timestamp |

## Demo data

The dashboard includes a **Load demo data** action. It writes deterministic records with IDs beginning with `demo-`, so running it repeatedly updates the same demo records instead of creating duplicates. Student image fields are intentionally empty because images must be uploaded through the Cloudinary form.
