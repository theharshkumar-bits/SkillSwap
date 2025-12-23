// Mock Data (Simulating a database)
const skillsData = [
    { id: 1, title: "Core Java", category: "Backend", desc: "OOP, Collections, and Exception Handling.", progress: 0 },
    { id: 2, title: "HTML5 & CSS3", category: "Frontend", desc: "Building responsive web layouts.", progress: 0 },
    { id: 3, title: "JavaScript ES6", category: "Frontend", desc: "DOM manipulation and modern syntax.", progress: 0 },
    { id: 4, title: "SQL / MySQL", category: "Database", desc: "Writing complex queries and joins.", progress: 0 },
    { id: 5, title: "Spring Boot", category: "Backend", desc: "Building REST APIs and microservices.", progress: 0 },
    { id: 6, title: "Bootstrap", category: "Frontend", desc: "Rapid responsive UI development.", progress: 0 }
];

// Load data from LocalStorage or use default
let skills = JSON.parse(localStorage.getItem('skillSwapData')) || skillsData;

const container = document.getElementById('skillsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Function to render skills
function renderSkills(filterText = '', filterCategory = 'All') {
    container.innerHTML = ''; // Clear current content

    skills.forEach(skill => {
        // Filter logic
        const matchesText = skill.title.toLowerCase().includes(filterText.toLowerCase());
        const matchesCategory = filterCategory === 'All' || skill.category === filterCategory;

        if (matchesText && matchesCategory) {
            const cardHTML = `
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm">
                        <div class="card-body">
                            <span class="badge bg-secondary mb-2">${skill.category}</span>
                            <h5 class="card-title">${skill.title}</h5>
                            
                            <label class="form-label mt-2">Progress: <span id="val-${skill.id}">${skill.progress}</span>%</label>
                            <input type="range" class="form-range" min="0" max="100" value="${skill.progress}" 
                                oninput="updateProgress(${skill.id}, this.value)">
                            
                            <button class="btn btn-outline-primary btn-sm btn-toggle" onclick="toggleDetails(${skill.id})">
                                Show Details
                            </button>

                            <div id="details-${skill.id}" class="details-section">
                                <p class="text-muted small">${skill.desc}</p>
                                <button class="btn btn-success btn-sm w-100" onclick="markComplete(${skill.id})">Mark Complete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}

// Update Progress and Save to LocalStorage
window.updateProgress = (id, value) => {
    const skill = skills.find(s => s.id === id);
    skill.progress = value;
    document.getElementById(`val-${id}`).innerText = value;
    saveData();
};

// Mark as 100% Complete
window.markComplete = (id) => {
    const slider = document.querySelector(`input[oninput="updateProgress(${id}, this.value)"]`);
    slider.value = 100;
    updateProgress(id, 100);
};

// Toggle Details Visibility
window.toggleDetails = (id) => {
    const details = document.getElementById(`details-${id}`);
    const btn = document.querySelector(`button[onclick="toggleDetails(${id})"]`);
    if (details.style.display === "block") {
        details.style.display = "none";
        btn.innerText = "Show Details";
    } else {
        details.style.display = "block";
        btn.innerText = "Hide Details";
    }
};

// Save to LocalStorage
function saveData() {
    localStorage.setItem('skillSwapData', JSON.stringify(skills));
}

// Event Listeners for Search and Filter
searchInput.addEventListener('input', (e) => renderSkills(e.target.value, categoryFilter.value));
categoryFilter.addEventListener('change', (e) => renderSkills(searchInput.value, e.target.value));

// Initial Render
renderSkills();