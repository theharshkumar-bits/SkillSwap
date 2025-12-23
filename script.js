console.log("SkillSwap App Loaded...");

// 1. Initial Data (Simulating a DB)
const initialData = [
    { id: 1, title: "Core Java", category: "Backend", desc: "OOP, Collections, and Exception Handling.", progress: 0 },
    { id: 2, title: "HTML5 & CSS3", category: "Frontend", desc: "Building responsive web layouts.", progress: 0 },
    { id: 3, title: "JavaScript ES6", category: "Frontend", desc: "DOM manipulation and modern syntax.", progress: 0 },
    { id: 4, title: "SQL / MySQL", category: "Database", desc: "Writing complex queries and joins.", progress: 0 },
    { id: 5, title: "Spring Boot", category: "Backend", desc: "Building REST APIs and microservices.", progress: 0 },
    { id: 6, title: "Bootstrap", category: "Frontend", desc: "Rapid responsive UI development.", progress: 0 }
];

// 2. Load data from LocalStorage OR use initialData if first time
let skillsList = JSON.parse(localStorage.getItem('mySkillSwapData')) || initialData;

// DOM Elements
const container = document.getElementById('skillsContainer');
const searchBox = document.getElementById('searchInput');
const filterBox = document.getElementById('categoryFilter');

// 3. Main Function to Display Skills
function renderUI(searchText = '', category = 'All') {
    // Clear existing content
    container.innerHTML = ''; 

    // Filter logic
    const filteredSkills = skillsList.filter(skill => {
        const matchesText = skill.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesCat = category === 'All' || skill.category === category;
        return matchesText && matchesCat;
    });

    // Check if no results found
    if (filteredSkills.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">No skills found.</div>';
        return;
    }

    // Loop through results and create HTML
    filteredSkills.forEach(skill => {
        const cardHTML = `
            <div class="col-md-4 col-sm-6">
                <div class="card p-3 h-100 shadow-sm">
                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">${skill.category}</span>
                        <h5 class="card-title">${skill.title}</h5>
                        
                        <div class="mt-3">
                            <label class="form-label small text-muted">Progress: <span id="val-${skill.id}" class="fw-bold text-primary">${skill.progress}%</span></label>
                            <input type="range" class="form-range" min="0" max="100" value="${skill.progress}" 
                                oninput="updateProgress(${skill.id}, this.value)">
                        </div>
                        
                        <button class="btn btn-outline-primary btn-sm btn-toggle" onclick="toggleDetails(${skill.id})">
                            Show Details
                        </button>

                        <div id="details-${skill.id}" class="details-section">
                            <p class="text-muted small mb-2">${skill.desc}</p>
                            <button class="btn btn-success btn-sm w-100" onclick="finishSkill(${skill.id})">Mark as Done</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 4. Update Progress Function
window.updateProgress = (id, value) => {
    // Find item and update value
    const skill = skillsList.find(s => s.id === id);
    if (skill) {
        skill.progress = value;
        document.getElementById(`val-${id}`).innerText = value + "%";
        saveToBrowser(); // Save changes
    }
};

// 5. Quick "Mark as Done" button
window.finishSkill = (id) => {
    console.log("Marking skill " + id + " as complete.");
    const rangeInput = document.querySelector(`input[oninput="updateProgress(${id}, this.value)"]`);
    rangeInput.value = 100;
    updateProgress(id, 100);
};

// 6. Toggle Description Visibility
window.toggleDetails = (id) => {
    const section = document.getElementById(`details-${id}`);
    const btn = document.querySelector(`button[onclick="toggleDetails(${id})"]`);
    
    if (section.style.display === "block") {
        section.style.display = "none";
        btn.innerText = "Show Details";
    } else {
        section.style.display = "block";
        btn.innerText = "Hide Details";
    }
};

// 7. Save to LocalStorage
function saveToBrowser() {
    localStorage.setItem('mySkillSwapData', JSON.stringify(skillsList));
    console.log("Data saved to LocalStorage.");
}

// Event Listeners for Search
searchBox.addEventListener('input', (e) => {
    console.log("Searching: " + e.target.value);
    renderUI(e.target.value, filterBox.value);
});

filterBox.addEventListener('change', (e) => {
    console.log("Filter changed to: " + e.target.value);
    renderUI(searchBox.value, e.target.value);
});

// Initial Load
renderUI();