/* ============================================================
   Attendance Management Controller
   ============================================================ */

document.addEventListener("DOMContentLoaded", async function () {
    checkAuth();

    // Set default date to today
    const dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Populate student dropdown options
    await populateStudentDropdown();

    // Render recent logs
    await loadAttendanceLogs();
});

// Populate student dropdown dynamically
async function populateStudentDropdown() {
    const students = await getRecords("students");
    const select = document.getElementById("student_id");
    if (!select) return;

    select.innerHTML = '<option value="">Select Student</option>';

    students.forEach(s => {
        const option = document.createElement("option");
        option.value = s.student_id;
        option.textContent = `${s.student_id} - ${s.first_name} ${s.last_name} (${s.class_name || s.class})`;
        select.appendChild(option);
    });
}

// Record Attendance Submit Handler
async function handleRecordAttendance(event) {
    event.preventDefault();

    const studentId = document.getElementById("student_id").value;
    const dateVal = document.getElementById("date").value;
    const statusVal = document.getElementById("status").value;

    if (!studentId || !dateVal || !statusVal) {
        alert("Please select student, date, and status.");
        return;
    }

    const record = {
        student_id: studentId,
        date: dateVal,
        status: statusVal
    };

    await addRecord("attendance", record);
    alert(`Attendance recorded for ${studentId}: ${statusVal}`);

    // Refresh logs
    await loadAttendanceLogs();
}

// Render Attendance Logs Table
async function loadAttendanceLogs() {
    const attendance = await getRecords("attendance");
    const students = await getRecords("students");
    const tbody = document.getElementById("attendanceTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (attendance.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No attendance records found.</td></tr>`;
        return;
    }

    // Sort newest date first
    const sorted = [...attendance].reverse();

    sorted.forEach((item, idx) => {
        // Find student details
        const student = students.find(s => s.student_id === item.student_id);
        const studentName = student ? `${student.first_name} ${student.last_name}` : "Unknown Student";

        let badgeClass = "badge-present";
        if (item.status === "Absent") badgeClass = "badge-absent";
        if (item.status === "Late") badgeClass = "badge-late";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><strong>${item.student_id}</strong></td>
            <td>${studentName}</td>
            <td>${item.date}</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}
