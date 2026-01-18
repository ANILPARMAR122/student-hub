const db = require('./config/db');

// --- 🟢 DATA: JOBS & INTERNSHIPS ---
const jobs = [
    { title: "Cafe Helper", company: "Coffee Corner Café", type: "Part-Time", location: "Vishrambag, Sangli", stipend: "₹250/day", description: "Timing: 5 PM – 10 PM", skills: "Service, Communication" },
    { title: "Computer Lab Assistant", company: "Shree Coaching Classes", type: "Part-Time", location: "MIDC Road, Sangli", stipend: "₹6,500/month", description: "Timing: 4 PM – 8 PM", skills: "Basic Computer, Admin" },
    { title: "Delivery Executive", company: "Sangli Local Mart", type: "Part-Time", location: "Sangli City", stipend: "₹9,000/month", description: "Timing: Flexible (3–4 hrs/day)", skills: "Driving, Time Management" },
    { title: "Home Tuition Teacher", company: "Private Tuition", type: "Part-Time", location: "Kupwad Road", stipend: "₹300/hour", description: "Timing: 6 PM – 8 PM", skills: "Teaching, Subject Knowledge" },
    { title: "Shop Assistant", company: "Patil General Store", type: "Part-Time", location: "Ganapati Peth", stipend: "₹5,500/month", description: "Timing: 3 PM – 7 PM", skills: "Sales, Management" },
    { title: "Library Assistant", company: "City Study Library", type: "Part-Time", location: "Sangli", stipend: "₹6,000/month", description: "Timing: 4 PM – 9 PM", skills: "Organization, Quiet" },
    { title: "Data Entry Operator", company: "Krishna Services", type: "Part-Time", location: "Vishrambag", stipend: "₹5,000/month", description: "Timing: 3 PM – 6 PM", skills: "Typing, Excel" },
    { title: "Event Helper", company: "Royal Events", type: "Part-Time", location: "Sangli", stipend: "₹600/day", description: "Timing: Weekend Based", skills: "Event Management, Active" },
    { title: "Office Boy", company: "Mahavir Enterprises", type: "Part-Time", location: "MIDC Sangli", stipend: "₹6,000/month", description: "Timing: 2 PM – 6 PM", skills: "Helper, Punctual" },
    { title: "Mobile Shop Assistant", company: "Galaxy Mobile Store", type: "Part-Time", location: "College Road", stipend: "₹7,000/month", description: "Timing: 4 PM – 8 PM", skills: "Mobile Tech, Sales" },
    { title: "Gym Reception Assistant", company: "FitLife Gym", type: "Part-Time", location: "Sangli City", stipend: "₹6,500/month", description: "Timing: 5 PM – 9 PM", skills: "Reception, Fitness Interest" },
    { title: "Printing Shop Helper", company: "Sai Xerox & Print", type: "Part-Time", location: "Ganapati Peth", stipend: "₹5,000/month", description: "Timing: 3 PM – 7 PM", skills: "Printing, Binding" },
    { title: "Supermarket Billing Assistant", company: "FreshMart", type: "Part-Time", location: "Vishrambag", stipend: "₹7,500/month", description: "Timing: 5 PM – 10 PM", skills: "Billing Software, Math" },
    { title: "Hotel Reception Helper", company: "Hotel Sangam", type: "Part-Time", location: "Sangli Bus Stand", stipend: "₹8,000/month", description: "Timing: Evening Shift", skills: "Hospitality, Polite" },
    { title: "Courier Office Assistant", company: "SpeedX Courier", type: "Part-Time", location: "Sangli", stipend: "₹6,000/month", description: "Timing: 4 PM – 8 PM", skills: "Logistics, Sorting" },
    // Internships
    { title: "Web Development Intern", company: "TechGrow Solutions", type: "Internship", location: "Remote / Sangli", stipend: "₹5,000/month", description: "Duration: 3 Months", skills: "HTML, CSS, JS" },
    { title: "Digital Marketing Intern", company: "Sangli Digital Media", type: "Internship", location: "Sangli", stipend: "₹4,000/month", description: "Duration: 2 Months", skills: "SEO, Social Media" },
    { title: "Graphic Design Intern", company: "Creative Pixel Studio", type: "Internship", location: "Remote", stipend: "₹5,000/month", description: "Duration: 2 Months", skills: "Photoshop, Canva" },
    { title: "Data Entry Intern", company: "Krishna Services", type: "Internship", location: "Vishrambag", stipend: "₹3,500/month", description: "Duration: 1–2 Months", skills: "Typing, Accuracy" },
    { title: "HR Intern", company: "Mahavir Enterprises", type: "Internship", location: "MIDC Sangli", stipend: "₹6,000/month", description: "Duration: 3 Months", skills: "Communication, Management" },
    { title: "Content Writing Intern", company: "Local News Portal", type: "Internship", location: "Remote", stipend: "₹4,000/month", description: "Duration: 2 Months", skills: "Writing, Blogging" },
    { title: "Accounting Intern", company: "Patil & Associates", type: "Internship", location: "Sangli", stipend: "₹5,500/month", description: "Duration: 3 Months", skills: "Tally, Excel" },
    { title: "Social Media Intern", company: "BrandBoost Agency", type: "Internship", location: "Sangli", stipend: "₹4,500/month", description: "Duration: 2 Months", skills: "Instagram, Reels" },
    { title: "Software Testing Intern", company: "CodeBase Technologies", type: "Internship", location: "Remote", stipend: "₹6,000/month", description: "Duration: 3 Months", skills: "Manual Testing, QA" },
    { title: "Marketing & Sales Intern", company: "SmartEdu Services", type: "Internship", location: "Sangli", stipend: "₹5,000/month", description: "Duration: 2 Months", skills: "Sales, English" }
];

// --- 🟢 DATA: MARKETPLACE PRODUCTS ---
const products = [
    { title: "Engineering Mathematics - Kumbhojkar", price: 350, category: "Books", description: "First year engineering book, good condition.", phone: "9822012345" },
    { title: "Let Us C - Yashwant Kanetkar", price: 200, category: "Books", description: "5th Edition. Helpful for C programming logic.", phone: "9822054321" },
    { title: "Casio fx-991ES Plus Calculator", price: 800, category: "Electronics", description: "Original scientific calculator. Allowed in exams.", phone: "8888899999" },
    { title: "Engineering Drafter (Omega)", price: 400, category: "Stationary", description: "Mini drafter for engineering drawing.", phone: "9850012345" },
    { title: "OnePlus Nord (2 Years Old)", price: 12000, category: "Electronics", description: "Good working condition. Screen replaced once.", phone: "7777788888" },
    { title: "Lab Coat (White, Size L)", price: 200, category: "Other", description: "Chemistry lab coat. Cleaned and ironed.", phone: "9876500000" },
    { title: "Data Structures & Algorithms", price: 450, category: "Books", description: "Standard textbook for CSA students. Like new.", phone: "9988776655" },
    { title: "HP Mouse & Keyboard Combo", price: 500, category: "Electronics", description: "Wireless combo. Battery included.", phone: "9922334455" },
    { title: "Roller Scale (30cm)", price: 50, category: "Stationary", description: "Smooth roller scale.", phone: "9123456789" },
    { title: "MPSC Competitive Exam Guide", price: 300, category: "Books", description: "Full set of notes for competitive exams.", phone: "9123456780" },
    { title: "Atlas Cycle (Black)", price: 3500, category: "Other", description: "Good condition cycle. New tyres.", phone: "9011223344" },
    { title: "Boat BassHeads Earphones", price: 250, category: "Electronics", description: "Wired earphones. Good bass.", phone: "8888812345" },
    { title: "Drawing Board (Full Size)", price: 600, category: "Stationary", description: "Wooden board for ED sheets.", phone: "9988001122" },
    { title: "Java: The Complete Reference", price: 600, category: "Books", description: "Very thick book, barely used.", phone: "9000011111" },
    { title: "Table Fan (Small)", price: 800, category: "Electronics", description: "High speed table fan for hostel room.", phone: "9112233445" },
    { title: "Arduino Uno Starter Kit", price: 1500, category: "Electronics", description: "Includes sensors, wires, and breadboard.", phone: "9999900000" },
    { title: "Study Table (Foldable)", price: 1200, category: "Other", description: "Wooden finish foldable table for laptop.", phone: "9223344556" },
    { title: "Mattress (Single Bed)", price: 1500, category: "Other", description: "Cotton mattress, very comfortable.", phone: "9334455667" },
    { title: "Bucket & Mug Set", price: 150, category: "Other", description: "Blue color plastic bucket.", phone: "9445566778" },
    { title: "Gym Dumbbells (5kg Pair)", price: 900, category: "Other", description: "Rubber coated hex dumbbells.", phone: "9556677889" }
];

// --- 🟢 DATA: PROJECTS ---
const projects = [
    { title: "AI Chatbot for Farmers", tech_stack: "Python, TensorFlow, React", team_size: 4, description: "Building an app to help farmers identify crop diseases using AI." },
    { title: "Student Hub Website", tech_stack: "Node.js, MySQL, HTML/CSS", team_size: 3, description: "A platform for students to find jobs, sell items, and collaborate." },
    { title: "Smart Traffic Light System", tech_stack: "IoT, Arduino, C++", team_size: 5, description: "Using sensors to manage traffic flow efficiently in Sangli." },
    { title: "E-Commerce for Local Arts", tech_stack: "MERN Stack", team_size: 4, description: "Helping local artisans sell their Ganesh idols and paintings online." },
    { title: "College Bus Tracker", tech_stack: "Flutter, Firebase, Maps API", team_size: 2, description: "Real-time bus tracking app for CIMDR students." }
];

// --- 🟢 DATA: EVENTS ---
const events = [
    { 
        title: "Inter-College Hackathon 2026", 
        organizer: "CIMDR Coding Club",
        event_date: "2026-02-15", 
        location: "Main Auditorium", 
        type: "Technical", 
        description: "24-hour coding battle. Win cash prizes worth ₹50,000.",
        registration_link: "https://forms.gle/hackathon"
    },
    { 
        title: "Annual Cultural Fest - Aarambh", 
        organizer: "Student Council",
        event_date: "2026-03-10", 
        location: "College Ground", 
        type: "Cultural", 
        description: "Dance, Music, and Drama performances by students.",
        registration_link: "https://forms.gle/culture"
    },
    { 
        title: "AI & Future Tech Seminar", 
        organizer: "Guest Speaker: Mr. Sharma",
        event_date: "2026-01-25", 
        location: "Seminar Hall 2", 
        type: "Workshop", 
        description: "Expert talk on 'Future of AI' by industry leaders.",
        registration_link: ""
    },
    { 
        title: "Cricket Tournament Finals", 
        organizer: "Sports Dept",
        event_date: "2026-02-05", 
        location: "Sports Complex", 
        type: "Sports", 
        description: "Final match between CSA and BCA departments.",
        registration_link: ""
    },
    { 
        title: "ReactJS Bootcamp", 
        organizer: "TechGrow",
        event_date: "2026-01-30", 
        location: "Computer Lab 3", 
        type: "Technical", 
        description: "Hands-on workshop for beginners. Laptop required.",
        registration_link: "https://forms.gle/react"
    }
];

// --- 🟢 NEW DATA: RECYCLING ITEMS (Matches Your DB) ---
const recyclingItems = [
    { item_name: "Old HP Monitor", category: "E-Waste", description: "Screen flickers, good for parts.", location: "Computer Lab 2", condition: "Damaged", points: 50, phone: "9988776655" },
    { item_name: "1st Year C++ Books", category: "Books", description: "Set of 3 textbooks (Balagurusamy).", location: "College Library", condition: "Good", points: 20, phone: "9123456780" },
    { item_name: "Lab Coat (Size M)", category: "Reusable", description: "White cotton lab coat, used for 1 semester.", location: "Chemistry Lab", condition: "Like New", points: 10, phone: "9988001122" },
    { item_name: "Broken Keyboard & Mouse", category: "E-Waste", description: "Not working. For recycling only.", location: "E-Waste Bin (Main Gate)", condition: "Scrap", points: 50, phone: "9822054321" },
    { item_name: "Drafter (Omega)", category: "Reusable", description: "Mini drafter, slightly loose screw but working.", location: "Drawing Hall", condition: "Good", points: 10, phone: "8888899999" }
];
// --- 🟢 DATA: SUBSCRIPTIONS (NEW!) ---
const subs = [
    { name: "Netflix", cost: 649, cycle: "Monthly", slots: 4, desc: "Premium 4K plan. Pay on 1st of month." },
    { name: "Spotify", cost: 179, cycle: "Monthly", slots: 6, desc: "Family Premium plan. Long term preferred." },
    { name: "ChatGPT", cost: 1650, cycle: "Monthly", slots: 4, desc: "Plus subscription sharing." },
    { name: "YouTube Premium", cost: 189, cycle: "Monthly", slots: 5, desc: "No ads, background play." }
];

async function seedDatabase() {
    console.log("🌱 Starting Master Seed Process...");
    try {
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // 1. JOBS
        console.log("🗑️  Clearing Jobs...");
        await db.execute('TRUNCATE TABLE jobs'); 
        console.log("📝 Inserting Jobs...");
        for (const job of jobs) {
            await db.execute(`INSERT INTO jobs (title, company, type, location, stipend, description, skills) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [job.title, job.company, job.type, job.location, job.stipend, job.description, job.skills]);
        }

        // 2. MARKETPLACE
        console.log("🗑️  Clearing Products...");
        await db.execute('TRUNCATE TABLE products');
        console.log("🛒 Inserting Products...");
        for (const item of products) {
            await db.execute(`INSERT INTO products (user_id, title, price, category, description, contact_phone, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [1, item.title, item.price, item.category, item.description, item.phone, null]);
        }

        // 3. PROJECTS
        console.log("🗑️  Clearing Projects...");
        await db.execute('TRUNCATE TABLE projects');
        console.log("🚀 Inserting Projects...");
        
        let counter = 0;
        for (const proj of projects) {
            const ownerId = (counter === 0) ? 1 : 2;
            await db.execute(`INSERT INTO projects (user_id, title, description, tech_stack, team_size, current_members, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [ownerId, proj.title, proj.description, proj.tech_stack, proj.team_size, 1, 'Open']);
            counter++;
        }

        // 4. EVENTS
        console.log("🗑️  Clearing Events...");
        await db.execute('TRUNCATE TABLE events');
        console.log("📅 Inserting Events...");
        for (const evt of events) {
            await db.execute(
                `INSERT INTO events (title, organizer, event_date, location, type, description, registration_link) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [evt.title, evt.organizer, evt.event_date, evt.location, evt.type, evt.description, evt.registration_link]
            );
        }

        // 🟢 5. RECYCLING (NEW PART)
        console.log("♻️  Clearing Recycling Items...");
        await db.execute('TRUNCATE TABLE recycling');
        console.log("🌱 Inserting Recycling Data...");
        
        for (const item of recyclingItems) {
            await db.execute(
                `INSERT INTO recycling (donor_id, item_name, category, description, pickup_location, condition_text, contact_phone, eco_points, status) VALUES (1, ?, ?, ?, ?, ?, ?, ?, 'Available')`, 
                [item.item_name, item.category, item.description, item.location, item.condition, item.phone, item.points]
            );
        }
        // 🟢 6. SUBSCRIPTIONS (NEW PART)
        console.log("💰 Clearing Subscriptions...");
        // Clear old data
        await db.execute('TRUNCATE TABLE subscriptions');
        await db.execute('TRUNCATE TABLE subscription_members');
        
        console.log("💸 Inserting Subscription Groups...");
        for (const s of subs) {
            // Owner ID is set to 1 (You) for testing
            await db.execute(`INSERT INTO subscriptions (owner_id, name, cost, cycle, max_slots, current_slots, description) VALUES (1, ?, ?, ?, ?, 1, ?)`, 
                [s.name, s.cost, s.cycle, s.slots, s.desc]);
        }

        await db.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log("\n✅ SUCCESS: Database Fully Refreshed!");
        console.log("👉 Jobs, Products, Projects, Events, and Recycling items loaded.");
        process.exit();
    } catch (error) {
        console.error("\n❌ ERROR:", error);
        process.exit(1);
    }
}

seedDatabase();