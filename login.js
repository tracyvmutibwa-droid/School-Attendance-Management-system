/* ============================================================
   Login Functionality
   ============================================================ */

async function loginUser(event) {
    event.preventDefault(); // Prevent form from refreshing page

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const alertBox = document.getElementById("alert-message");

    // Clear previous alerts
    if (alertBox) {
        alertBox.style.display = "none";
        alertBox.textContent = "";
    }

    let isAuthenticated = false;

    // Check credentials against Supabase if connected
    if (db) {
        try {
            const { data, error } = await db
                .from("users")
                .select("*")
                .eq("username", usernameInput)
                .eq("password", passwordInput);

            if (!error && data && data.length > 0) {
                isAuthenticated = true;
            }
        } catch (err) {
            console.warn("Supabase auth error, checking default fallback", err);
        }
    }

    // Default Fallback Admin Credentials (username: admin, password: admin123)
    if (!isAuthenticated && usernameInput === "admin" && passwordInput === "admin123") {
        isAuthenticated = true;
    }

    if (isAuthenticated) {
        // Save session logged-in status
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", usernameInput);

        // Redirect to Dashboard
        window.location.href = "dashboard.html";
    } else {
        // Show error message
        if (alertBox) {
            alertBox.textContent = "Invalid username or password. Please try again.";
            alertBox.style.display = "block";
        } else {
            alert("Invalid username or password.");
        }
    }
}
