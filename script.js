console.log("SkillSwap App Loaded...");

// --- PART 1: ROADMAP GENERATOR DATA ---
// I created a simple 'dictionary' for common tech skills.
const learningPaths = {
    "java": {
        steps: ["Learn JDK setup & Variables", "Control Flow (If/Else, Loops)", "OOPs (Class, Object, Inheritance)", "Collections Framework", "Exception Handling", "JDBC & Database Connectivity", "Spring Boot Basics"],
        resources: [
            { name: "Oracle Documentation", link: "https://docs.oracle.com/en/java/" },
            { name: "CodeCademy (Java)", link: "https://www.codecademy.com/learn/learn-java" },
            { name: "LeetCode (Practice)", link: "https://leetcode.com/" }
        ]
    },
    "react": {
        steps: ["HTML/CSS Refresher", "ES6+ JavaScript (Arrow functions, Destructuring)", "JSX & Components", "Props & State (useState)", "useEffect & Lifecycle", "React Router", "Redux Toolkit / Context API"],
        resources: [
            { name: "React Official Docs", link: "https://react.dev/" },
            { name: "FreeCodeCamp", link: "https://www.freecodecamp.org/" },
            { name: "CodeSandbox (Practice)", link: "https://codesandbox.io/" }
        ]
    },
    "python": {
        steps: ["Syntax & Variables", "Lists, Tuples, Dictionaries", "Functions & Modules", "File Handling", "OOP in Python", "Libraries (Pandas, NumPy)", "Web Frameworks (Flask/Django)"],
        resources: [
            { name: "Python.org Docs", link: "https://docs.python.org/3/" },
            { name: "Automate the Boring Stuff", link: "https://automatetheboringstuff.com/" },
            { name: "HackerRank (Practice)", link: "https://www.hackerrank.com/domains/python" }
        ]
    },
    "sql": {
        steps: ["Select, From, Where", "Joins (Inner, Left, Right)", "Group By & Aggregates", "Subqueries", "Table Creation & Constraints", "Normalization", "Stored Procedures"],
        resources: [
            { name: "W3Schools SQL", link: "https://www.w3schools.com/sql/" },
            { name: "SQLZoo (Practice)", link: "https://sqlzoo.net/" },
            { name: "Mode Analytics Tutorial", link: "https://mode.com/sql-tutorial/" }
        ]
    },
    // Default fallback if skill isn't found
    "default": {
        steps: ["Understand the Basics (Syntax)", "Setup Development Environment", "Build a 'Hello World' App", "Learn Core Concepts", "Build a Mini Project", "Read Official Documentation"],
        resources: [
            { name: "YouTube Tutorials", link: "https://www.youtube.com/" },
            { name: "Stack Overflow", link: "https://stackoverflow.com/" },
            { name: "Official Documentation", link: "#" }
        ]
    }
};

// --- ROADMAP FUNCTIONALITY ---
function generateRoadmap() {
    const input = document.getElementById('targetSkillInput').value.toLowerCase().trim();
    const resultDiv = document.getElementById('roadmapResult');
    const skillTitle = document.getElementById('skillName');
    const stepsList = document.getElementById('roadmapSteps');
    const resourceList = document.getElementById('roadmapResources');

    if (!input) {
        alert("Please enter a skill name first!");
        return;
    }

    console.log("Generating roadmap for:", input);

    // Get data or fallback to default
    // We check if the input exists in our object, otherwise use 'default'
    const data = learningPaths[input] || learningPaths['default'];
    
    // Update UI
    resultDiv.style.display = "block";
    skillTitle.innerText = input.charAt(0).toUpperCase() + input.slice(1); // Capitalize
    
    // Clear previous lists
    stepsList.innerHTML = "";
    resourceList.innerHTML = "";

    // Inject Steps
    data.steps.forEach(step => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = step;
        stepsList.appendChild(li);
    });

    // Inject Resources
    data.resources.forEach(res => {
        let li = document.createElement("li");
        li.innerHTML = `<i class="bi bi-link-45deg"></i> <a href="${res.link}" target="_blank">${res.name}</a>`;
        resourceList.appendChild(li);
    });
}


// --- PART 2: TRACKER DATA (Existing Code) ---

const initialData = [
    { id: 1, title: "Core Java", category: "Backend", desc: "OOP, Collections, and Exception Handling.", progress: 60 },
    { id: 2, title: "HTML5 & CSS3", category: "Frontend", desc: "Building responsive web layouts.", progress: 90 },
    { id: 3, title: "JavaScript ES6", category: "Frontend", desc: "DOM manipulation and modern syntax.", progress: 40 },
    { id: 4, title: "SQL / MySQL", category: "Database", desc: "Writing complex queries and joins.", progress: 75 },
    { id: 5, title: "Spring Boot", category: "Backend", desc: "Building REST APIs and microservices.", progress: 10 },
    { id: 6, title: "Bootstrap", category: "Frontend", desc: "Rapid responsive UI development.", progress: 85 }
];

let skillsList = JSON.parse(localStorage.getItem('mySkillSwapData')) || initialData;

const container = document.getElementById('skillsContainer');
const searchBox = document.getElementById('searchInput');
const filterBox = document.getElementById('categoryFilter');

function renderUI(searchText = '', category = 'All') {
    container.innerHTML = ''; 

    const filteredSkills = skillsList.filter(skill => {
        const matchesText = skill.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesCat = category === 'All' || skill.category === category;
        return matchesText && matchesCat;
    });

    if (filteredSkills.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">No skills found.</div>';
        return;
    }

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

window.updateProgress = (id, value) => {
    const skill = skillsList.find(s => s.id === id);
    if (skill) {
        skill.progress = value;
        document.getElementById(`val-${id}`).innerText = value + "%";
        saveToBrowser();
    }
};

window.finishSkill = (id) => {
    console.log("Marking skill " + id + " as complete.");
    const rangeInput = document.querySelector(`input[oninput="updateProgress(${id}, this.value)"]`);
    rangeInput.value = 100;
    updateProgress(id, 100);
};

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

function saveToBrowser() {
    localStorage.setItem('mySkillSwapData', JSON.stringify(skillsList));
}

searchBox.addEventListener('input', (e) => {
    renderUI(e.target.value, filterBox.value);
});

filterBox.addEventListener('change', (e) => {
    renderUI(searchBox.value, e.target.value);
});

// Initial Load
renderUI();