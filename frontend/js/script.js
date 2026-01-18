/**
 * js/script.js
 * FINAL PROFESSIONAL CONTROLLER
 * Includes: Jobs, Marketplace, Projects, My Teams, and Campus Events
 */

let allJobsData = [];
let allProjects = [];
let allProducts = [];
let allEvents = [];

// 1. AUTH GUARD
function checkAuth() {
    const path = window.location.pathname;
    const publicPages = ['login.html', 'signup.html'];
    const isPublic = publicPages.some(page => path.includes(page));
    const state = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    if ((!state || !state.user) && !isPublic) window.location.href = 'login.html';
}
checkAuth();

// 2. INIT - ROUTER
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('internship.html')) {
        renderInternships();
        setupFilters();
    }
    if (path.includes('applications.html')) {
        renderMyApplications();
    }
    if (path.includes('marketplace.html')) {
        renderMarketplace();
    }
    if (path.includes('project-collaboration.html')) {
        renderProjects();
    }
    if (path.includes('my-teams.html')) {
        renderMyTeams();
    }
    // 🟢 UPDATED: Detects 'event.html' (singular)
    if (path.includes('event.html')) {
        renderEvents();
    }

    if (path.includes('recycling.html')) {
        renderRecycling();
    }

    // 🟢 ADD THIS NEW CHECK:
    if (path.includes('subscription-splitter.html')) {
        renderSubscriptions();
    }
    if (path.includes('chat.html')) {
        renderChatContacts();
    }
});

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const locFilter = document.getElementById('locFilter');
    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
        typeFilter.addEventListener('change', filterJobs);
        locFilter.addEventListener('change', filterJobs);
    }
}

// --- 🟢 JOB FETCHING ---
async function renderInternships() {
    const container = document.getElementById('internshipGrid');
    if (!container) return;

    container.innerHTML = Array(4).fill(0).map(() => `
        <div class="animate-pulse bg-white p-6 rounded-3xl h-64 border border-gray-100">
            <div class="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>`).join('');

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/jobs');
        if (!response.ok) throw new Error("Server Connection Failed");
        const result = await response.json();

        if (result.success) {
            allJobsData = result.data;
            allJobsData.sort(() => Math.random() - 0.5);
            displayJobs(allJobsData);
        } else {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-500">No jobs found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">⚠️ Backend not running.</p>`;
    }
}

function filterJobs() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const loc = document.getElementById('locFilter').value;

    const filtered = allJobsData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search) || job.company.toLowerCase().includes(search);
        const matchesType = type === 'All' || job.type === type;
        const matchesLoc = loc === 'All' || job.location.includes(loc === 'Remote' ? 'Remote' : loc);
        return matchesSearch && matchesType && matchesLoc;
    });
    displayJobs(filtered);
}

function displayJobs(jobs) {
    const container = document.getElementById('internshipGrid');
    if (jobs.length === 0) { container.innerHTML = `<div class="col-span-full text-center text-gray-400">No jobs found.</div>`; return; }

    container.innerHTML = jobs.map(job => `
        <div class="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl transition group flex flex-col h-full relative">
            <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 text-gray-600 border border-gray-100 flex items-center justify-center text-xl font-bold shadow-sm">${job.company.charAt(0)}</div>
                <span class="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">${job.type}</span>
            </div>
            <div class="mb-4 flex-1">
                <h3 class="font-bold text-gray-900 text-lg leading-tight mb-1">${job.title}</h3>
                <p class="text-xs text-gray-500 font-medium">${job.company} • ${job.location}</p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto gap-3">
                <div class="flex flex-col"><span class="text-[10px] text-gray-400 font-bold uppercase">Pay</span><span class="font-bold text-gray-900 text-sm">${job.stipend}</span></div>
                <div class="flex gap-2">
                    <button onclick="openModal('${job.id}')" class="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><i class="fa-regular fa-eye"></i></button>
                    <button onclick="openAppForm('${job.id}', '${job.title}', '${job.company}')" class="px-4 py-2 bg-brand-black text-white text-xs font-bold rounded-xl shadow hover:bg-brand-blue transition">Apply</button>
                </div>
            </div>
        </div>`).join('');
}

// --- 🟢 APPLICATION SYSTEM ---
window.openAppForm = (id, title, company) => {
    document.getElementById('applyJobId').value = id;
    document.getElementById('applyCompanyName').value = company;
    document.getElementById('applyJobTitle').innerText = title + " at " + company;
    const modal = document.getElementById('applicationFormModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closeAppForm = () => {
    const modal = document.getElementById('applicationFormModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

window.submitApplication = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 0;

    if (!userId) { alert("Please login again."); return; }

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
        const response = await fetch('https://student-hub-110s.onrender.com/api/applications/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Application Sent to Company!');
            closeAppForm();
            e.target.reset();
            if (window.location.pathname.includes('applications.html')) renderMyApplications();
        } else {
            alert('⚠️ ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Server Error. Try again later.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

window.renderMyApplications = async () => {
    const container = document.getElementById('myApplicationsGrid');
    if (!container) return;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 0;

    container.innerHTML = '<p class="col-span-full text-center py-10 text-gray-400">Loading your history...</p>';

    try {
        const response = await fetch(`https://student-hub-110s.onrender.com/api/applications/my/${userId}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(app => `
                <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition relative group">
                    <div class="absolute top-4 right-4 text-green-500 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase">${app.status}</div>
                    <h3 class="font-bold text-gray-900 text-lg mb-1">${app.job_title}</h3>
                    <p class="text-xs text-gray-500 font-bold uppercase mb-4">${app.company}</p>
                    <div class="bg-gray-50 p-4 rounded-xl mb-4">
                        <div class="text-sm space-y-1 text-gray-600">
                            <p><i class="fa-regular fa-calendar mr-2"></i> Applied: ${new Date(app.applied_at).toLocaleDateString()}</p>
                            <p><i class="fa-solid fa-phone mr-2"></i> ${app.phone}</p>
                        </div>
                    </div>
                    <button onclick="cancelApplication(${app.id})" class="w-full py-2 border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition">Cancel Application</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No applications found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Could not fetch applications.</p>`;
    }
}

window.cancelApplication = async (appId) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
        const response = await fetch(`https://student-hub-110s.onrender.com/api/applications/cancel/${appId}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert("Application withdrawn.");
            renderMyApplications();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Server Error. Could not cancel.");
    }
}

window.openModal = (id) => {
    const job = allJobsData.find(j => j.id == id);
    if (!job) return;
    const modal = document.getElementById('jobModal');
    const content = document.getElementById('modalContent');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    content.innerHTML = `
        <div class="relative bg-white w-full max-h-[90vh] overflow-y-auto">
            <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition z-10"><i class="fa-solid fa-xmark"></i></button>
            <div class="bg-gray-50 p-8 border-b border-gray-100"><h2 class="text-2xl font-bold text-gray-900 mb-1">${job.title}</h2><p class="text-gray-500 text-sm">${job.company} • ${job.location}</p></div>
            <div class="p-8">
                <div class="grid grid-cols-2 gap-4 mb-6"><div class="bg-gray-50 p-3 rounded-xl border border-gray-100"><p class="text-xs text-gray-400 font-bold uppercase">Stipend</p><p class="font-bold text-brand-blue">${job.stipend}</p></div><div class="bg-gray-50 p-3 rounded-xl border border-gray-100"><p class="text-xs text-gray-400 font-bold uppercase">Type</p><p class="font-bold text-gray-800">${job.type}</p></div></div>
                <h3 class="font-bold text-gray-900 mb-2">Description</h3><p class="text-sm text-gray-600 mb-6 leading-relaxed">${job.description}</p>
                <button onclick="openAppForm('${job.id}', '${job.title}', '${job.company}'); closeModal();" class="w-full bg-brand-black text-white py-3 rounded-xl font-bold shadow-lg hover:bg-brand-blue transition">Apply Now</button>
            </div>
        </div>`;
}
window.closeModal = () => { document.getElementById('jobModal').classList.add('hidden'); document.getElementById('jobModal').classList.remove('flex'); }

window.openPostModal = () => { document.getElementById('postJobModal').classList.remove('hidden'); document.getElementById('postJobModal').classList.add('flex'); }
window.closePostModal = () => { document.getElementById('postJobModal').classList.add('hidden'); document.getElementById('postJobModal').classList.remove('flex'); }

window.handlePostJob = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());
    btn.innerText = "Publishing...";
    btn.disabled = true;
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ Job Posted Successfully!');
            closePostModal();
            e.target.reset();
            renderInternships();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Server Error.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// --- 🛒 MARKETPLACE SYSTEM ---
async function renderMarketplace() {
    const container = document.getElementById('marketplaceGrid');
    if (!container) return;
    const searchInput = document.getElementById('marketSearch');
    const catFilter = document.getElementById('marketCatFilter');
    if (searchInput) {
        searchInput.addEventListener('input', () => filterMarketplace());
        catFilter.addEventListener('change', () => filterMarketplace());
    }
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/marketplace');
        const result = await response.json();
        if (result.success) {
            window.allProducts = result.data;
            displayProducts(window.allProducts);
        } else {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No items found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load marketplace.</p>`;
    }
}

function displayProducts(products) {
    const container = document.getElementById('marketplaceGrid');
    if (products.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-400 py-20"><i class="fa-solid fa-box-open text-4xl mb-4"></i><p>No matching items found.</p></div>`;
        return;
    }
    container.innerHTML = products.map(item => {
        let imageDisplay = '';
        if (item.image_url && item.image_url !== 'null') {
            const imgSrc = `https://student-hub-110s.onrender.com/uploads/${item.image_url}`;
            imageDisplay = `<img src="${imgSrc}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">`;
        } else {
            let bgClass = 'bg-gray-100 text-gray-400';
            let icon = 'fa-box';
            if (item.category === 'Books') { bgClass = 'bg-blue-50 text-blue-300'; icon = 'fa-book'; }
            if (item.category === 'Electronics') { bgClass = 'bg-purple-50 text-purple-300'; icon = 'fa-laptop'; }
            if (item.category === 'Stationary') { bgClass = 'bg-yellow-50 text-yellow-400'; icon = 'fa-pen-ruler'; }
            if (item.category === 'Other') { bgClass = 'bg-orange-50 text-orange-300'; icon = 'fa-bicycle'; }
            imageDisplay = `<div class="w-full h-full ${bgClass} flex items-center justify-center group-hover:scale-110 transition duration-700"><i class="fa-solid ${icon} text-6xl"></i></div>`;
        }
        return `
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full relative">
            <div class="h-48 relative overflow-hidden">${imageDisplay}<span class="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-extrabold px-3 py-1 rounded-full shadow-sm text-gray-600 border border-gray-100">${item.category}</span></div>
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2 gap-2"><h3 class="font-bold text-gray-900 text-lg leading-snug line-clamp-2">${item.title}</h3><span class="font-bold text-brand-orange bg-orange-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap">₹${item.price}</span></div>
                <p class="text-xs text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">${item.description}</p>
                <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center"><div class="flex flex-col"><span class="text-[10px] uppercase font-bold text-gray-400">Seller Contact</span><span class="text-xs font-bold text-gray-700 tracking-wide font-mono">${item.contact_phone.replace(/.(?=.{4})/g, '•')}</span></div><a href="tel:${item.contact_phone}" class="bg-brand-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-brand-blue hover:shadow-blue-200 transition flex items-center gap-2"><i class="fa-solid fa-phone"></i> Call</a></div>
            </div>
        </div>`;
    }).join('');
}
function filterMarketplace() {
    const search = document.getElementById('marketSearch').value.toLowerCase();
    const cat = document.getElementById('marketCatFilter').value;
    const filtered = window.allProducts.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
        const matchCat = cat === 'All' || item.category === cat;
        return matchSearch && matchCat;
    });
    displayProducts(filtered);
}
window.openSellModal = () => { document.getElementById('sellModal').classList.remove('hidden'); document.getElementById('sellModal').classList.add('flex'); }
window.closeSellModal = () => { document.getElementById('sellModal').classList.add('hidden'); document.getElementById('sellModal').classList.remove('flex'); }
window.handleSellItem = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;
    const formData = new FormData(e.target);
    formData.append('userId', userId);
    btn.innerText = "Uploading...";
    btn.disabled = true;
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/marketplace/add', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
            alert('✅ Item Listed Successfully!');
            closeSellModal();
            e.target.reset();
            renderMarketplace();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Server Error.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// =======================================================
// 🟢 PROJECT COLLABORATION SYSTEM
// =======================================================
async function renderProjects() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;

    const searchInput = document.getElementById('projectSearch');
    const stackFilter = document.getElementById('stackFilter');

    if (searchInput) {
        searchInput.addEventListener('input', () => filterProjects());
        stackFilter.addEventListener('change', () => filterProjects());
    }

    try {
        const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
        const userId = session ? session.user.id : null;

        const response = await fetch('https://student-hub-110s.onrender.com/api/projects');
        const result = await response.json();

        let myAppliedIds = new Set();
        if (userId) {
            try {
                const myResponse = await fetch(`https://student-hub-110s.onrender.com/api/projects/my/${userId}`);
                const myResult = await myResponse.json();
                if (myResult.success) {
                    myResult.data.forEach(p => myAppliedIds.add(p.id));
                }
            } catch (e) { console.error("Could not fetch my apps", e); }
        }

        if (result.success) {
            window.allProjects = result.data;
            window.myAppliedIds = myAppliedIds;
            displayProjects(window.allProjects);
        } else {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No active projects found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load projects.</p>`;
    }
}

function filterProjects() {
    const search = document.getElementById('projectSearch').value.toLowerCase();
    const stack = document.getElementById('stackFilter').value;

    const filtered = window.allProjects.filter(proj => {
        const matchSearch = proj.title.toLowerCase().includes(search) ||
            proj.description.toLowerCase().includes(search) ||
            proj.tech_stack.toLowerCase().includes(search);

        const matchStack = stack === 'All' || proj.tech_stack.toLowerCase().includes(stack.toLowerCase());

        return matchSearch && matchStack;
    });
    displayProjects(filtered);
}

function displayProjects(projects) {
    const container = document.getElementById('projectsGrid');
    const userId = JSON.parse(localStorage.getItem('studentHub_Session_v1'))?.user?.id;

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 opacity-60">
                <i class="fa-solid fa-layer-group text-5xl mb-4"></i>
                <p class="font-medium">No matching projects found.</p>
            </div>`;
        return;
    }

    container.innerHTML = projects.map((proj, index) => {
        const tags = proj.tech_stack.split(',').map(tag =>
            `<span class="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-gray-100 shadow-sm">${tag.trim()}</span>`
        ).join('');

        const gradients = [
            'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600', 'from-orange-400 to-orange-600'
        ];
        const gradient = gradients[index % gradients.length];
        const progress = (proj.current_members / proj.team_size) * 100;
        const slotsLeft = proj.team_size - proj.current_members;

        const hasApplied = window.myAppliedIds.has(proj.id);
        const isLeader = proj.user_id === userId;

        let buttonHtml = '';
        if (isLeader) {
            buttonHtml = `
            <button disabled class="w-full py-3.5 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2">
                <span>👑 You are the Leader</span>
            </button>`;
        } else if (hasApplied) {
            buttonHtml = `
            <button disabled class="w-full py-3.5 bg-green-50 text-green-600 border border-green-100 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2">
                <i class="fa-solid fa-check-circle"></i> <span>Request Sent</span>
            </button>`;
        } else {
            buttonHtml = `
            <button id="btn-${proj.id}" onclick="openJoinModal(${proj.id})" class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-brand-purple hover:shadow-purple-200 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>Request to Join</span> <i class="fa-solid fa-arrow-right text-xs opacity-50"></i>
            </button>`;
        }

        return `
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group">
            
            <div class="flex justify-between items-start mb-5">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-xl font-bold shadow-md transform group-hover:scale-110 transition duration-300">
                    ${proj.title.charAt(0)}
                </div>
                <div class="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                    <span class="text-[10px] font-extrabold text-green-600 uppercase tracking-wider">Hiring</span>
                </div>
            </div>
            
            <h3 class="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-brand-purple transition">${proj.title}</h3>
            <p class="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">${proj.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-8">
                ${tags}
            </div>

            <div class="mt-auto pt-6 border-t border-dashed border-gray-100">
                <div class="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    <span>${slotsLeft} Slots Left</span>
                    <span>${proj.current_members}/${proj.team_size} Joined</span>
                </div>
                
                <div class="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
                    <div class="bg-gradient-to-r ${gradient} h-full rounded-full transition-all duration-1000" style="width: ${progress}%"></div>
                </div>

                ${buttonHtml}
            </div>
        </div>`;
    }).join('');
}

window.openJoinModal = (projectId) => {
    document.getElementById('joinProjectId').value = projectId;
    document.getElementById('joinModal').classList.remove('hidden');
    document.getElementById('joinModal').classList.add('flex');
}
window.closeJoinModal = () => {
    document.getElementById('joinModal').classList.add('hidden');
    document.getElementById('joinModal').classList.remove('flex');
}

window.submitJoinRequest = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalContent = btn.innerHTML;
    const form = e.target;

    const projectId = document.getElementById('joinProjectId').value;
    const classInfo = document.getElementById('joinClassInfo').value;
    const message = document.getElementById('joinMessage').value;
    const fullMessage = `Class: ${classInfo} | Note: ${message}`;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;

    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
    btn.classList.add('opacity-75', 'cursor-not-allowed');
    btn.disabled = true;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/projects/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, userId, message: fullMessage })
        });

        const result = await response.json();

        if (result.success) {
            btn.classList.remove('bg-brand-purple', 'hover:bg-purple-700');
            btn.classList.add('bg-green-500', 'text-white', 'scale-105');
            btn.innerHTML = `<i class="fa-solid fa-check-circle text-lg"></i> Request Sent!`;

            const gridBtn = document.getElementById(`btn-${projectId}`);
            if (gridBtn) {
                gridBtn.outerHTML = `
                <button disabled class="w-full py-3.5 bg-green-50 text-green-600 border border-green-100 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2">
                    <i class="fa-solid fa-check-circle"></i> <span>Request Sent</span>
                </button>`;
                window.myAppliedIds.add(parseInt(projectId));
            }

            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => input.disabled = true);

            setTimeout(() => {
                closeJoinModal();
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalContent;
                    btn.classList.remove('bg-green-500', 'scale-105', 'opacity-75', 'cursor-not-allowed');
                    btn.classList.add('bg-brand-purple');
                    btn.disabled = false;
                    inputs.forEach(input => input.disabled = false);
                }, 500);
            }, 1500);

        } else {
            alert(result.message);
            btn.innerHTML = originalContent;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            btn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        alert("Server Error");
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

async function renderMyTeams() {
    const container = document.getElementById('myTeamsGrid');
    if (!container) return;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;

    try {
        const response = await fetch(`https://student-hub-110s.onrender.com/api/projects/my/${userId}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(p => {
                const isLeader = p.role === 'Leader';

                const cardBorder = isLeader ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-gray-300';
                const roleBadge = isLeader
                    ? `<span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-purple-200 shadow-sm">👑 Leader</span>`
                    : `<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-gray-200">👤 Member</span>`;

                const statusBadge = p.status === 'Open'
                    ? `<span class="text-green-600 font-bold text-xs flex items-center gap-1"><span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active</span>`
                    : `<span class="text-gray-400 font-bold text-xs flex items-center gap-1"><span class="w-2 h-2 bg-gray-400 rounded-full"></span> ${p.status}</span>`;

                let actionBtn;
                if (isLeader) {
                    actionBtn = `
                    <button onclick="openEditModal('${p.id}', '${p.title}', '${p.tech_stack}', '${p.status}', \`${p.description}\`)" 
                        class="w-full mt-4 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:border-purple-500 hover:text-purple-600 transition flex items-center justify-center gap-2 group">
                        <i class="fa-solid fa-pen-to-square group-hover:scale-110 transition"></i> Edit Project
                    </button>`;
                } else {
                    actionBtn = `
                    <button onclick="leaveTeam('${p.id}')" 
                        class="w-full mt-4 py-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Resign from Team
                    </button>`;
                }

                return `
                <div class="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${cardBorder}">
                    <div class="flex justify-between items-start mb-4">
                        ${roleBadge}
                        ${statusBadge}
                    </div>
                    <h3 class="font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-brand-purple transition">${p.title}</h3>
                    <p class="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block mb-4 border border-gray-100">
                        <i class="fa-solid fa-code mr-1"></i> ${p.tech_stack}
                    </p>
                    <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">${p.description}</p>
                    ${actionBtn}
                </div>`;
            }).join('');
        } else {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400">No teams found.</div>`;
        }
    } catch (e) { console.error(e); }
}

window.leaveTeam = async (projectId) => {
    if (!confirm("Are you sure you want to resign from this team?")) return;
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/projects/leave', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, userId })
        });
        const result = await response.json();
        if (result.success) {
            alert("You have left the team.");
            renderMyTeams();
        } else {
            alert("Error: " + result.message);
        }
    } catch (e) {
        console.error(e);
        alert("Server Error");
    }
}

window.openEditModal = (id, title, stack, status, desc) => {
    document.getElementById('editProjectId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editStack').value = stack;
    document.getElementById('editStatus').value = status;
    document.getElementById('editDesc').value = desc;
    document.getElementById('editModal').classList.remove('hidden');
    document.getElementById('editModal').classList.add('flex');
}
window.closeEditModal = () => {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editModal').classList.remove('flex');
}
window.handleUpdateProject = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    btn.innerText = "Saving...";
    btn.disabled = true;
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/projects/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert("✅ Project Updated!");
            closeEditModal();
            renderMyTeams();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Server Error");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

window.openProjectModal = () => { document.getElementById('projectModal').classList.remove('hidden'); document.getElementById('projectModal').classList.add('flex'); }
window.closeProjectModal = () => { document.getElementById('projectModal').classList.add('hidden'); document.getElementById('projectModal').classList.remove('flex'); }
window.handlePostProject = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.userId = userId;
    btn.innerText = "Posting...";
    btn.disabled = true;
    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/projects/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ Project Posted!');
            closeProjectModal();
            e.target.reset();
            renderProjects();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) { console.error(error); alert('Server Error.'); } finally { btn.innerText = originalText; btn.disabled = false; }
}

// ==========================================
// 5. CAMPUS EVENTS SYSTEM 📅 (MATCHING YOUR DB)
// ==========================================
async function renderEvents() {
    const container = document.getElementById('eventsGrid');
    if (!container) return;

    const search = document.getElementById('eventSearch');
    const filter = document.getElementById('eventFilter');
    if (search) {
        search.addEventListener('input', filterEvents);
        filter.addEventListener('change', filterEvents);
    }

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/events');
        const result = await response.json();

        if (result.success) {
            allEvents = result.data;
            displayEvents(allEvents);
        } else {
            container.innerHTML = `<p class="col-span-full text-center text-gray-400">No upcoming events.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load events.</p>`;
    }
}

function filterEvents() {
    const s = document.getElementById('eventSearch').value.toLowerCase();
    const f = document.getElementById('eventFilter').value;

    const filtered = allEvents.filter(e => {
        return (e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s)) &&
            (f === 'All' || e.type === f);
    });
    displayEvents(filtered);
}

function displayEvents(events) {
    const container = document.getElementById('eventsGrid');
    if (events.length === 0) { container.innerHTML = `<p class="col-span-full text-center text-gray-400">No events match your filter.</p>`; return; }

    container.innerHTML = events.map(evt => {
        // 🟢 Uses event_date from your DB
        const d = new Date(evt.event_date);
        const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = d.getDate();

        // 🟢 Uses type from your DB
        let badgeColor = 'bg-gray-100 text-gray-600';
        if (evt.type === 'Technical') badgeColor = 'bg-blue-50 text-blue-600 border-blue-100';
        if (evt.type === 'Cultural') badgeColor = 'bg-pink-50 text-pink-600 border-pink-100';
        if (evt.type === 'Sports') badgeColor = 'bg-orange-50 text-orange-600 border-orange-100';

        // 🟢 Uses registration_link
        const linkBtn = evt.registration_link
            ? `<a href="${evt.registration_link}" target="_blank" class="w-full py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-brand-red transition flex items-center justify-center gap-2 decoration-none">
                 <span>Register Now</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
               </a>`
            : `<button disabled class="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">No Link Available</button>`;

        return `
        <div class="bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition group overflow-hidden flex flex-col h-full">
            <div class="p-6 flex gap-5">
                <div class="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 shrink-0 shadow-sm group-hover:scale-110 transition">
                    <span class="text-xs font-bold text-red-500 uppercase tracking-widest">${month}</span>
                    <span class="text-2xl font-black text-gray-800">${day}</span>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2 py-1 rounded text-[10px] font-bold uppercase border ${badgeColor}">${evt.type}</span>
                    </div>
                    <h3 class="font-bold text-lg leading-tight mb-1 text-gray-900 group-hover:text-red-500 transition">${evt.title}</h3>
                    <p class="text-xs text-gray-500 font-medium"><i class="fa-solid fa-location-dot mr-1"></i> ${evt.location}</p>
                </div>
            </div>
            <div class="px-6 pb-6 mt-auto">
                <p class="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">${evt.description}</p>
                ${linkBtn}
            </div>
        </div>`;
    }).join('');
}

window.openEventModal = () => { document.getElementById('eventModal').classList.remove('hidden'); document.getElementById('eventModal').classList.add('flex'); }
window.closeEventModal = () => { document.getElementById('eventModal').classList.add('hidden'); document.getElementById('eventModal').classList.remove('flex'); }

window.handlePostEvent = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const organizer = session ? session.user.name : "Student Organizer";

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.organizer = organizer;

    btn.innerText = "Publishing...";
    btn.disabled = true;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/events/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ Event Published!');
            closeEventModal();
            e.target.reset();
            renderEvents();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// ==========================================
// 6. RECYCLING HUB SYSTEM 🌱
// ==========================================
let allRecyclingItems = [];

async function renderRecycling() {
    const container = document.getElementById('recyclingGrid');
    if (!container) return;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/recycling');
        const result = await response.json();

        if (result.success) {
            allRecyclingItems = result.data;
            displayRecycling(allRecyclingItems);
        } else {
            container.innerHTML = `<p class="col-span-full text-center text-gray-400">No items available.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load items.</p>`;
    }
}

function filterRecycling(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.innerText.includes(category) || (category === 'All' && btn.innerText.includes('All'))) {
            btn.classList.add('bg-brand-green', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'text-gray-600', 'border');
        } else {
            btn.classList.remove('bg-brand-green', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-gray-600', 'border');
        }
    });

    if (category === 'All') {
        displayRecycling(allRecyclingItems);
    } else {
        const filtered = allRecyclingItems.filter(item => item.category.includes(category));
        displayRecycling(filtered);
    }
}

function displayRecycling(items) {
    const container = document.getElementById('recyclingGrid');
    if (items.length === 0) { container.innerHTML = `<p class="col-span-full text-center text-gray-400">No items match.</p>`; return; }

    container.innerHTML = items.map(item => {
        let icon = 'fa-box';
        let color = 'text-green-600 bg-green-50';
        if (item.category === 'E-Waste') { icon = 'fa-plug'; color = 'text-red-500 bg-red-50'; }
        if (item.category === 'Books') { icon = 'fa-book'; color = 'text-blue-500 bg-blue-50'; }

        return `
        <div class="bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-xl transition flex flex-col h-full relative group">
            <div class="absolute top-4 right-4 bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-full">+${item.eco_points} XP</div>
            <div class="flex items-start gap-4 mb-3">
                <div class="w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-lg shrink-0">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div>
                    <h3 class="font-bold text-gray-900 leading-tight">${item.item_name}</h3>
                    <span class="text-xs text-gray-400">${item.category} • ${item.condition_text || 'Good'}</span>
                </div>
            </div>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">${item.description}</p>
            
            <div class="mb-4 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-brand-green"></i> ${item.pickup_location}
            </div>

            <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <a href="tel:${item.contact_phone}" class="text-xs font-bold text-gray-600 hover:text-brand-green"><i class="fa-solid fa-phone mr-1"></i> Contact</a>
                <button onclick="alert('Item Claimed! 🌿')" class="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-brand-green transition">Claim</button>
            </div>
        </div>`;
    }).join('');
}

// Modal Logic
window.openDonateModal = () => { document.getElementById('donateModal').classList.remove('hidden'); document.getElementById('donateModal').classList.add('flex'); }
window.closeDonateModal = () => { document.getElementById('donateModal').classList.add('hidden'); document.getElementById('donateModal').classList.remove('flex'); }

window.handleDonateItem = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.userId = userId;

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/recycling/donate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            closeDonateModal();
            e.target.reset();
            renderRecycling();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// // ==========================================
// 7. SUBSCRIPTION SPLITTER SYSTEM 💰
// ==========================================

async function renderSubscriptions() {
    const container = document.getElementById('subsGrid');
    if (!container) return;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/subscriptions');
        const result = await response.json();

        if (result.success) {
            displaySubscriptions(result.data);
        } else {
            container.innerHTML = `<p class="col-span-full text-center text-gray-400">No active groups found.</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load groups.</p>`;
    }
}

function displaySubscriptions(subs) {
    const container = document.getElementById('subsGrid');
    if (subs.length === 0) { container.innerHTML = `<p class="col-span-full text-center text-gray-400">No groups found.</p>`; return; }

    container.innerHTML = subs.map(sub => {
        // Calculate Cost Per Person
        const costPerPerson = Math.ceil(sub.cost / sub.max_slots);
        const slotsLeft = sub.max_slots - sub.current_slots;
        const progress = (sub.current_slots / sub.max_slots) * 100;

        // Branding Logos & Colors
        let logo = '<i class="fa-solid fa-shapes"></i>';
        let color = 'text-gray-600 bg-gray-100';

        if (sub.name === 'Netflix') { logo = 'N'; color = 'text-red-600 bg-red-100 font-black'; }
        if (sub.name === 'Spotify') { logo = '<i class="fa-brands fa-spotify"></i>'; color = 'text-green-600 bg-green-100'; }
        if (sub.name === 'ChatGPT') { logo = '<i class="fa-solid fa-robot"></i>'; color = 'text-teal-600 bg-teal-100'; }
        if (sub.name === 'YouTube') { logo = '<i class="fa-brands fa-youtube"></i>'; color = 'text-red-500 bg-red-50'; }
        if (sub.name === 'Prime') { logo = '<i class="fa-brands fa-amazon"></i>'; color = 'text-blue-600 bg-blue-100'; }

        return `
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col h-full group">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl shrink-0">
                    ${logo}
                </div>
                <div class="text-right">
                    <span class="block text-lg font-black text-gray-900">₹${costPerPerson}</span>
                    <span class="text-[10px] uppercase font-bold text-gray-400">Per Person / ${sub.cycle.charAt(0)}</span>
                </div>
            </div>
            
            <h3 class="font-bold text-lg text-gray-900 mb-1">${sub.name}</h3>
            <p class="text-xs text-gray-500 mb-4 h-8 line-clamp-2">${sub.description || 'No description provided.'}</p>

            <div class="mt-auto pt-4 border-t border-gray-50">
                <div class="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                    <span>${slotsLeft} Slots Left</span>
                    <span>${sub.current_slots}/${sub.max_slots}</span>
                </div>
                
                <div class="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                    <div class="bg-brand-blue h-full rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
                
                <button onclick="joinGroup(${sub.id})" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span>Join Group</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

// Join Logic
window.joinGroup = async (groupId) => {
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;

    if (!confirm("Are you sure you want to join this group? You will be expected to pay your share.")) return;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/subscriptions/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        const result = await response.json();

        if (result.success) {
            alert("✅ Successfully Joined! Contact the admin for payment.");
            renderSubscriptions();
        } else {
            alert("⚠️ " + result.message);
        }
    } catch (e) {
        console.error(e);
        alert("Server Error: Could not join group.");
    }
}

// Modal Logic
window.openSubModal = () => { document.getElementById('subModal').classList.remove('hidden'); document.getElementById('subModal').classList.add('flex'); }
window.closeSubModal = () => { document.getElementById('subModal').classList.add('hidden'); document.getElementById('subModal').classList.remove('flex'); }

window.handleCreateSub = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const userId = session ? session.user.id : 1;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.userId = userId;

    btn.innerText = "Creating...";
    btn.disabled = true;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/subscriptions/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            alert('✅ Group Created Successfully!');
            closeSubModal();
            e.target.reset();
            renderSubscriptions();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server Error: Could not create group.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
// ==========================================
// 8. IN-BUILT CHAT SYSTEM 💬
// ==========================================
let currentChatUserId = null;
let chatPollInterval = null;

// 🟢 Add this to INIT function at top:
// if (path.includes('chat.html')) renderChatContacts();

async function renderChatContacts() {
    const container = document.getElementById('contactsList');
    if (!container) return;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const myId = session ? session.user.id : 0;

    try {
        const response = await fetch(`https://student-hub-110s.onrender.com/api/chat/contacts?currentUserId=${myId}`);
        const result = await response.json();

        if (result.success) {
            container.innerHTML = result.data.map(user => `
                <div onclick="openChat(${user.id}, '${user.name}')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group">
                    <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm group-hover:bg-brand-purple group-hover:text-white transition">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${user.name}</h4>
                        <p class="text-xs text-gray-400">Tap to chat</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

window.openChat = (userId, userName) => {
    currentChatUserId = userId;
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('chatHeader').classList.remove('hidden');
    document.getElementById('chatHeader').classList.add('flex');
    document.getElementById('messagesContainer').classList.remove('hidden');
    document.getElementById('inputArea').classList.remove('hidden');

    document.getElementById('headerName').innerText = userName;
    document.getElementById('headerAvatar').innerText = userName.charAt(0);

    loadMessages();

    // Poll for new messages every 3 seconds
    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(loadMessages, 3000);
}

async function loadMessages() {
    if (!currentChatUserId) return;
    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const myId = session ? session.user.id : 0;
    const container = document.getElementById('messagesContainer');

    try {
        const response = await fetch(`https://student-hub-110s.onrender.com/api/chat/messages?userId1=${myId}&userId2=${currentChatUserId}`);
        const result = await response.json();

        if (result.success) {
            container.innerHTML = result.data.map(msg => {
                const isMe = msg.sender_id === myId;
                const alignClass = isMe ? 'ml-auto bg-brand-purple text-white rounded-br-none' : 'mr-auto bg-white border border-gray-100 text-gray-800 rounded-bl-none';

                // Show "Anonymous" tag if applicable
                const senderName = isMe ? "You" : msg.sender_name;
                const anonBadge = (msg.is_anonymous === 1 && !isMe)
                    ? `<span class="bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded ml-2">HIDDEN IDENTITY</span>`
                    : '';

                // Report Button (Only for incoming messages)
                const reportBtn = !isMe
                    ? `<button onclick="reportMessage(${msg.id})" class="text-[10px] text-red-300 hover:text-red-500 underline ml-2 mt-1 block">Report</button>`
                    : '';

                return `
                <div class="max-w-[70%] w-fit p-4 rounded-2xl shadow-sm mb-2 ${alignClass}">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-bold opacity-70 uppercase tracking-wider">${senderName}</span>
                        ${anonBadge}
                    </div>
                    <p class="text-sm leading-relaxed">${msg.message}</p>
                    ${reportBtn}
                </div>`;
            }).join('');
        }
    } catch (e) { console.error(e); }
}

window.sendMessage = async (e) => {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const isAnon = document.getElementById('anonToggle').checked;
    const message = input.value.trim();
    if (!message) return;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));
    const myId = session ? session.user.id : 0;

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: myId,
                receiverId: currentChatUserId,
                message: message,
                isAnonymous: isAnon
            })
        });

        if ((await response.json()).success) {
            input.value = '';
            loadMessages(); // Refresh immediately
        }
    } catch (e) { console.error(e); alert('Failed to send.'); }
}

window.reportMessage = async (msgId) => {
    const reason = prompt("Why are you reporting this message? (e.g., Harassment, Spam)");
    if (!reason) return;

    const session = JSON.parse(localStorage.getItem('studentHub_Session_v1'));

    try {
        const response = await fetch('https://student-hub-110s.onrender.com/api/chat/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reporterId: session.user.id, messageId: msgId, reason })
        });
        alert((await response.json()).message);
    } catch (e) { console.error(e); }
}
chatPollInterval = setInterval(loadMessages, 3000);