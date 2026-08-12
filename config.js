/* ============================================================
   School Attendance Management System - Database Configuration
   Supabase Client Setup & Data Access Helpers
   ============================================================ */

// ------------------------------------------------------------
// 1. SUPABASE CONFIGURATION
// Replace the values below with your actual Supabase Project details!
// ------------------------------------------------------------
const SUPABASE_URL = "https://ugevugwytuuziwruexbp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FPWJ9ihdMvoZlBetg4MoAw_Cql5d-Se";

// Initialize Supabase Client if library is loaded & keys configured
let db = null;
if (window.supabase && SUPABASE_URL !== "https://your-supabase-project.supabase.co") {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase connected successfully!");
} else {
    console.log("Running in LocalStorage mode (Supabase URL not configured yet).");
}

// ------------------------------------------------------------
// 2. LOCAL STORAGE INITIALIZATION (No mock data)
// ------------------------------------------------------------

// Initialize empty localStorage if no data exists
function initLocalStorage() {
    if (!localStorage.getItem("students")) {
        localStorage.setItem("students", JSON.stringify([]));
    }
    if (!localStorage.getItem("teachers")) {
        localStorage.setItem("teachers", JSON.stringify([]));
    }
    if (!localStorage.getItem("attendance")) {
        localStorage.setItem("attendance", JSON.stringify([]));
    }
}
initLocalStorage();

// ------------------------------------------------------------
// 3. AUTHENTICATION SESSION GUARD
// ------------------------------------------------------------
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

function logoutUser() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

// ------------------------------------------------------------
// 4. DATA HELPER FUNCTIONS (Supabase + Local Storage Sync)
// ------------------------------------------------------------

// Fetch all records from a table/collection
async function getRecords(table) {
    let remoteData = null;
    if (db) {
        try {
            const { data, error } = await db.from(table).select("*");
            if (!error && data) {
                remoteData = data;
            } else if (error) {
                console.warn(`Supabase select error on ${table}:`, error.message);
            }
        } catch (e) {
            console.warn("Supabase fetch exception:", e);
        }
    }
    
    const localData = JSON.parse(localStorage.getItem(table) || "[]");
    
    // Merge or fallback to local data if remote is null
    if (remoteData !== null && remoteData.length > 0) {
        return remoteData;
    }
    return localData;
}

// Insert a record into a table/collection
async function addRecord(table, record) {
    // 1. Save locally for instant UI update
    const current = JSON.parse(localStorage.getItem(table) || "[]");
    current.push(record);
    localStorage.setItem(table, JSON.stringify(current));

    // 2. Sync to Supabase if connected
    if (db) {
        try {
            const { error } = await db.from(table).insert([record]);
            if (error) {
                console.error(`Supabase insert error on ${table}:`, error.message);
                if (error.code === "42501" || error.message.includes("policy") || error.message.includes("row-level security")) {
                    alert(`Supabase Note: Please run this command in Supabase SQL Editor to allow saving:\n\nALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`);
                }
            } else {
                console.log(`Successfully saved to Supabase table: ${table}`);
            }
        } catch (e) {
            console.warn("Supabase insert exception:", e);
        }
    }
}

// Delete a record from a table/collection by key field
async function deleteRecord(table, keyField, keyValue) {
    // 1. Delete locally
    let current = JSON.parse(localStorage.getItem(table) || "[]");
    current = current.filter(item => item[keyField] !== keyValue);
    localStorage.setItem(table, JSON.stringify(current));

    // 2. Delete on Supabase
    if (db) {
        try {
            const { error } = await db.from(table).delete().eq(keyField, keyValue);
            if (error) {
                console.error(`Supabase delete error on ${table}:`, error.message);
            }
        } catch (e) {
            console.warn("Supabase delete exception:", e);
        }
    }
}
