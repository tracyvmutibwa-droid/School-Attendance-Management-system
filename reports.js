/* ============================================================
   Attendance Reports Controller
   ============================================================ */

document.addEventListener("DOMContentLoaded", async function () {
    checkAuth();
    await populateReportFilterDropdown();
    await generateReports();
});

// Populate student filter dropdown
async function populateReportFilterDropdown() {
    const students = await getRecords("students");
    const select = document.getElementById("student_id");
    if (!select) return;

    select.innerHTML = '<option value="">All Students</option>';
    students.forEach(s => {
        const option = document.createElement("option");
        option.value = s.student_id;
        option.textContent = `${s.student_id} - ${s.first_name} ${s.last_name}`;
        select.appendChild(option);
    });
}

// Generate & Filter Reports
async function generateReports(event) {
    if (event) event.preventDefault();

    const selectedStudent = document.getElementById("student_id").value;
    const startDate = document.getElementById("start_date").value;
    const endDate = document.getElementById("end_date").value;

    const students = await getRecords("students");
    let attendance = await getRecords("attendance");

    // Apply filters
    if (selectedStudent) {
        attendance = attendance.filter(a => a.student_id === selectedStudent);
    }
    if (startDate) {
        attendance = attendance.filter(a => a.date >= startDate);
    }
    if (endDate) {
        attendance = attendance.filter(a => a.date <= endDate);
    }

    const tbody = document.getElementById("reportsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No student records found in the system.</td></tr>`;
        return;
    }

    // Determine target students list
    const targetStudents = selectedStudent 
        ? students.filter(s => s.student_id === selectedStudent)
        : students;

    targetStudents.forEach(student => {
        const studentRecords = attendance.filter(a => a.student_id === student.student_id);
        const total = studentRecords.length;
        const present = studentRecords.filter(a => a.status === "Present").length;
        const absent = studentRecords.filter(a => a.status === "Absent").length;
        const late = studentRecords.filter(a => a.status === "Late").length;

        // Calculate attendance rate (Present counts fully, Late counts half or present)
        const percent = total > 0 ? Math.round((present / total) * 100) : 0;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${student.student_id}</strong></td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${total}</td>
            <td><span class="badge badge-present">${present}</span></td>
            <td><span class="badge badge-absent">${absent}</span></td>
            <td><span class="badge badge-late">${late}</span></td>
            <td><strong>${percent}%</strong></td>
        `;
        tbody.appendChild(row);
    });
}
