/* ============================================================
   Student Management Controller
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
    loadStudentsTable();
});

// Add New Student
async function handleAddStudent(event) {
    event.preventDefault();

    const studentId = document.getElementById("student_id").value.trim();
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const gender = document.getElementById("gender").value;
    const className = document.getElementById("class").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!studentId || !firstName || !lastName || !className) {
        alert("Please fill in all required fields.");
        return;
    }

    const newStudent = {
        student_id: studentId,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        class_name: className,
        phone: phone
    };

    await addRecord("students", newStudent);
    alert("Student added successfully!");
    
    // Clear Form
    document.getElementById("studentForm").reset();
    
    // Refresh Table
    loadStudentsTable();
}

// Render Students Table
async function loadStudentsTable() {
    const students = await getRecords("students");
    const tbody = document.getElementById("studentsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No students found. Add your first student above!</td></tr>`;
        return;
    }

    students.forEach((s, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${s.student_id}</strong></td>
            <td>${s.first_name} ${s.last_name}</td>
            <td>${s.gender}</td>
            <td>${s.class_name || s.class}</td>
            <td>${s.phone}</td>
            <td>
                <button class="btn btn-danger" onclick="removeStudent('${s.student_id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Remove Student
async function removeStudent(studentId) {
    if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
        await deleteRecord("students", "student_id", studentId);
        loadStudentsTable();
    }
}
