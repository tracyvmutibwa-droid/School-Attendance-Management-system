/* ============================================================
   Teacher Management Controller
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
    loadTeachersTable();
});

// Add New Teacher
async function handleAddTeacher(event) {
    event.preventDefault();

    const teacherId = document.getElementById("teacher_id").value.trim();
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const subject = document.getElementById("subject").value.trim();

    if (!teacherId || !firstName || !lastName || !subject) {
        alert("Please fill in all fields.");
        return;
    }

    const newTeacher = {
        teacher_id: teacherId,
        first_name: firstName,
        last_name: lastName,
        subject: subject
    };

    await addRecord("teachers", newTeacher);
    alert("Teacher added successfully!");

    // Clear Form
    document.getElementById("teacherForm").reset();

    // Refresh Table
    loadTeachersTable();
}

// Render Teachers Table
async function loadTeachersTable() {
    const teachers = await getRecords("teachers");
    const tbody = document.getElementById("teachersTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (teachers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No teachers found. Add your first teacher above!</td></tr>`;
        return;
    }

    teachers.forEach((t, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${t.teacher_id}</strong></td>
            <td>${t.first_name} ${t.last_name}</td>
            <td>${t.subject}</td>
            <td>
                <button class="btn btn-danger" onclick="removeTeacher('${t.teacher_id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Delete Teacher
async function removeTeacher(teacherId) {
    if (confirm(`Are you sure you want to delete teacher ${teacherId}?`)) {
        await deleteRecord("teachers", "teacher_id", teacherId);
        loadTeachersTable();
    }
}
