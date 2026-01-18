/**
 * js/script.js
 * 🟢 FIXED: Points to Live Render Server (Not Localhost)
 */

// 🟢 THE IMPORTANT PART: Define the API URL once
const API_URL = "https://student-hub-110s.onrender.com";

// 1. AUTH GUARD
function checkAuth() {
    const path = window.location.pathname;
    const publicPages = ['login.html', 'signup.html'];
    const isPublic = publicPages.some(page => path.includes(page));
    const state = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    if ((!state || !state.user) && !isPublic) window.location.href = 'login.html';
}
checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('internship.html')) renderInternships();
    if (path.includes('applications.html')) renderMyApplications();
    if (path.includes('marketplace.html')) renderMarketplace();
    if (path.includes('project-collaboration.html')) renderProjects();
    if (path.includes('my-teams.html')) renderMyTeams();
    if (path.includes('event.html')) renderEvents();
    if (path.includes('recycling.html')) renderRecycling();
    if (path.includes('subscription-splitter.html')) renderSubscriptions();
    if (path.includes('chat.html')) renderChatContacts();
});

// --- 🟢 JOB FETCHING (Fixed URL) ---
async function renderInternships() {
    const container = document.getElementById('internshipGrid');
    if (!container) return;

    try {
        // 🟢 USING LIVE URL
        const response = await fetch(`${API_URL}/api/jobs`); 
        if (!response.ok) throw new Error("Server Connection Failed");
        const result = await response.json();

        if (result.success) {
            displayJobs(result.data);
        } else {
            container.innerHTML = `<p class="col-span-full text-center text-gray-500">No jobs found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">⚠️ Backend error. Refresh page.</p>`;
    }
}

function displayJobs(jobs) {
    const container = document.getElementById('internshipGrid');
    container.innerHTML = jobs.map(job => `
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-lg">${job.title}</h3>
            <p class="text-xs text-gray-500">${job.company}</p>
            <button onclick="openAppForm('${job.id}', '${job.title}', '${job.company}')" class="mt-4 w-full bg-black text-white py-2 rounded-xl text-sm font-bold">Apply</button>
        </div>`).join('');
}

// --- 🟢 APPLICATION SYSTEM ---
window.submitApplication = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 0;

    const appData = {
        userId: userId,
        jobId: document.getElementById('applyJobId').value,
        name: document.getElementById('appName').value,
        email: document.getElementById('appEmail').value,
        age: document.getElementById('appAge').value,
        phone: document.getElementById('appPhone').value
    };

    btn.innerText = "Submitting...";
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/applications/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ Sent!');
            window.location.reload();
        } else {
            alert('⚠️ ' + result.message);
        }
    } catch (error) {
        alert('Server Error.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}