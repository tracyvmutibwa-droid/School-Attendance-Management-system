/* ============================================================
   Dashboard Overview Controller
   ============================================================ */

document.addEventListener("DOMContentLoaded", async function () {
    // 1. Verify user is logged in
    checkAuth();

    // 2. Load Stats Data
    const students = await getRecords("students");
    const teachers = await getRecords("teachers");
    const attendance = await getRecords("attendance");

    // Display counts
    document.getElementById("total-students").textContent = students.length;
    document.getElementById("total-teachers").textContent = teachers.length;

    // Calculate today's attendance rate
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter(a => a.date === todayStr);

    if (todayRecords.length > 0) {
        const presentCount = todayRecords.filter(a => a.status === "Present").length;
        const rate = Math.round((presentCount / todayRecords.length) * 100);
        document.getElementById("today-rate").textContent = rate + "%";
    } else {
        document.getElementById("today-rate").textContent = "N/A";
    }
});
