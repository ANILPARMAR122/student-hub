/**
 * js/admin.js
 * ADMIN DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Store exists (from store.js)
    if (typeof Store === 'undefined') {
        console.error("Store.js not loaded!");
        return;
    }

    // Initialize Dashboard
    initDashboard();
});

function initDashboard() {
    renderOverviewCards();
    renderCharts();
    setupNavigation();
}

// --- DATA AGGREGATION HELPERS ---
function getAdminData() {
    const localData = Store.get();
    
    // 🧠 INTELLIGENT MOCKING: 
    // Since we only have frontend data for 1 user, we simulate college-wide stats
    // by multiplying local actions or using realistic baseline numbers.
    
    return {
        students: {
            total: 1250, // Mock: Total college strength
            activeToday: 342,
            classDist: { 'FY': 400, 'SY': 380, 'TY': 470 },
            inactive: 45
        },
        market: {
            total: localData.marketplace.length + 120, // Real + Mock
            sold: Math.floor(localData.marketplace.length * 0.4) + 45,
            free: localData.marketplace.filter(i => i.price == 0).length + 12,
            categories: { 'Books': 45, 'Electronics': 30, 'Stationery': 25, 'Others': 20 }
        },
        jobs: {
            internships: localData.jobs.filter(j => j.type === 'Internship').length + 15,
            jobs: localData.jobs.filter(j => j.type !== 'Internship').length + 8,
            applied: localData.jobs.filter(j => j.applied).length + 89
        },
        chat: {
            total: localData.messages.length + 1500, // Mock history
            reported: 12, // Safety stat
            blocked: 3
        },
        events: {
            total: localData.events.length + 5,
            registrations: 450, // Mock
            popularSkill: "Web Development"
        },
        projects: {
            total: localData.projects.length + 22,
            active: 18,
            completed: 4
        },
        sustainability: {
            donations: localData.recycling.length + 56,
            eWaste: localData.recycling.filter(i => i.category === 'E-Waste').length + 20,
            points: (localData.recycling.length * 50) + 1200
        }
    };
}

// --- RENDER FUNCTIONS ---

function renderOverviewCards() {
    const data = getAdminData();
    
    document.getElementById('cardTotalStudents').innerText = data.students.total;
    document.getElementById('cardActiveToday').innerText = data.students.activeToday;
    document.getElementById('cardMarketItems').innerText = data.market.total;
    document.getElementById('cardProjects').innerText = data.projects.total;
    document.getElementById('cardDonations').innerText = data.sustainability.donations;
    document.getElementById('cardIssues').innerText = data.chat.reported;
}

function renderCharts() {
    const data = getAdminData();
    const ctxColors = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

    // 1. Student Activity Chart (Bar)
    new Chart(document.getElementById('chartActivity'), {
        type: 'bar',
        data: {
            labels: ['BCA FY', 'BCA SY', 'BCA TY', 'MCA FY', 'MCA SY'],
            datasets: [{
                label: 'Active Students',
                data: [320, 290, 410, 150, 180], // Mock distribution
                backgroundColor: '#2563EB',
                borderRadius: 4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // 2. Marketplace Categories (Doughnut)
    new Chart(document.getElementById('chartMarket'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(data.market.categories),
            datasets: [{
                data: Object.values(data.market.categories),
                backgroundColor: ctxColors
            }]
        },
        options: { responsive: true }
    });

    // 3. Project Technologies (Pie)
    new Chart(document.getElementById('chartTech'), {
        type: 'pie',
        data: {
            labels: ['React', 'Python', 'Java', 'Flutter', 'Node.js'],
            datasets: [{
                data: [30, 25, 20, 15, 10], // Mock tech spread
                backgroundColor: ctxColors
            }]
        },
        options: { responsive: true }
    });
}

// --- NAVIGATION LOGIC ---
function setupNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.report-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active classes
            links.forEach(l => l.classList.remove('bg-brand-blue', 'text-white'));
            links.forEach(l => l.classList.add('text-gray-400', 'hover:bg-gray-800'));
            
            // Add active class
            link.classList.remove('text-gray-400', 'hover:bg-gray-800');
            link.classList.add('bg-brand-blue', 'text-white');

            // Show section
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(sec => {
                if (sec.id === targetId) sec.classList.remove('hidden');
                else sec.classList.add('hidden');
            });
        });
    });
}

// Logout
window.handleAdminLogout = () => {
    if(confirm("Logout from Admin Panel?")) {
        window.location.href = "index.html";
    }
}