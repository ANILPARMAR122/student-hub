/**
 * js/store.js
 * UNIFIED DATA STORE
 */

// 🔴 FIXED: New Key to force a fresh start
const APP_KEY = "studentHub_Session_v1"; 

const getRelativeDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const mockData = {
    // 🔴 User is null, so the app WILL ask for login
    user: null, 
    
    // --- MOCK DATA ---
    recycling: [
        { id: "rec001", name: "Old Laptop (HP)", category: "E-Waste", condition: "Non-working", donor: "Om Kulkarni", status: "Available", image: "https://placehold.co/300x200/374151/white?text=E-Waste" },
        { id: "rec002", name: "Drafting Kit", category: "Reusable Items", condition: "Working", donor: "Aditi Joshi", status: "Available", image: "https://placehold.co/300x200/166534/white?text=Kit" }
    ],
    projects: [
        { id: "proj001", title: "Student Hub Web App", type: "Startup Idea", tech: ["HTML", "JS"], members: 3, maxMembers: 5, match: 95 }
    ],
    events: [
        { id: 301, title: "Web Dev Workshop", organizer: "IT Forum", date: getRelativeDate(2), location: "Sangli", registered: false }
    ],
    marketplace: [
        { id: 101, title: "DBMS Textbook", category: "Books", price: 250, condition: "Good", image: "https://placehold.co/300x200/2563EB/white?text=Book", seller: "Rahul" }
    ],
    jobs: [
        { id: 201, title: "Web Developer Intern", company: "TechFlow", type: "Internship", location: "Sangli", stipend: "₹5000", applied: false }
    ],
    messages: [] // Chat messages
};

const Store = {
    init() {
        if (!localStorage.getItem(APP_KEY)) {
            localStorage.setItem(APP_KEY, JSON.stringify(mockData));
        }
    },
    get() {
        return JSON.parse(localStorage.getItem(APP_KEY)) || mockData;
    },
    update(key, newData) {
        const data = this.get();
        data[key] = newData;
        localStorage.setItem(APP_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('storageUpdated'));
    },
    getItemById(key, id) {
        const data = this.get();
        return data[key].find(i => i.id == id);
    },
    getMessages(mode) {
        const data = this.get();
        if (mode === 'class') return [{ text: "Class cancelled?", sender: "Rahul", isMe: false }];
        return [{ text: "How to apply for internship?", sender: "Anonymous", isMe: true }];
    }
};

Store.init();