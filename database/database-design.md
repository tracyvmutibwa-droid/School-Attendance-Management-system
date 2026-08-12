
# School Attendance Management System - Database Design

## 1. Users Table

The Users table stores information about people who are allowed to log into the system.

| Field | Data Type | Description |
|---|---|---|
| user_id | INT | Unique identification number |
| username | VARCHAR(50) | User's login name |
| password | VARCHAR(255) | User's password |
| role | VARCHAR(20) | User's role |

## 2. Students Table

The Students table stores information about students registered in the school.

| Field | Data Type | Description |
|---|---|---|
| student_id | INT | Unique student identification number |
| first_name | VARCHAR(50) | Student's first name |
| last_name | VARCHAR(50) | Student's last name |
| gender | VARCHAR(10) | Student's gender |
| class | VARCHAR(50) | Student's class |
| phone | VARCHAR(20) | Student's contact number |

## 3. Teachers Table

The Teachers table stores information about teachers.

| Field | Data Type | Description |
|---|---|---|
| teacher_id | INT | Unique teacher identification number |
| first_name | VARCHAR(50) | Teacher's first name |
| last_name | VARCHAR(50) | Teacher's last name |
| subject | VARCHAR(50) | Subject taught |

## 4. Attendance Table

The Attendance table stores the attendance records of students.

| Field | Data Type | Description |
|---|---|---|
| attendance_id | INT | Unique attendance record |
| student_id | INT | Identifies the student |
| date | DATE | Date attendance was recorded |
| status | VARCHAR(20) | Present, Absent, or Late |
| teacher_id | INT | Identifies the teacher who recorded attendance |

## Relationships

- One student can have many attendance records.
- One teacher can record many attendance records.
- A user can have one role such as Administrator, Teacher, or Student.
- The student_id in the Attendance table connects attendance records to the Students table.
- The teacher_id in the Attendance table connects attendance records to the Teachers table.
