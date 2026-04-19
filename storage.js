// creates three empty lists for bugs, people and projects
let allBugs = [];
let allPeople = [];
let allProjects = [];

// saves the three lists to the browser's memory
function saveEverything() {
    // converts the list into texts because the local storage only stores text
    localStorage.setItem('bugs', JSON.stringify(allBugs));
    localStorage.setItem('people', JSON.stringify(allPeople));
    localStorage.setItem('projects', JSON.stringify(allProjects));
}

// this function loads the data from the data that is saved in the browser
function loadEverything() {
    let bugs = localStorage.getItem('bugs');
    let people = localStorage.getItem('people');
    let projects = localStorage.getItem('projects');

    // verifies that the data is saved if it is it converts the text into an array  
    if (bugs) {
        allBugs = JSON.parse(bugs);
        allPeople = JSON.parse(people);
        allProjects = JSON.parse(projects);
    } else {
        // sample data if there are no saved data
        allPeople = [
            { id: "1", name: "Abongile", surname: "Tyekela", email: "abongile@tyekela.com", username: "abongile" },
            { id: "2", name: "Nthathi", surname: "Mpyana", email: "nthathi@mpyana.com", username: "nthathi" },
            {id: "3", name: "Ditheto", surname: "Phaho", email: "ditheto@phapho.com", username: "ditheto"},
            {id: "4", name: "Phaka", surname: "Molokomme", email: "phaka@molokomme.com", username: "phaka"}
        ];
        allProjects = [
            { id: "1", name: "E-commerce App" },
            { id: "2", name: "Company Website" }
        ];
        // each bug is a folder with all its information
        allBugs = [
            { id: "1", summary: "Login broken", description: "Button does nothing", priority: "high", status: "open", projectId: "1", assignedPersonId: "1", targetDate: "2026-04-20", actualDate: "", resolution: "" },
            { id: "2", summary: "App crashes", description: "Closes on startup", priority: "high", status: "open", projectId: "1", assignedPersonId: "2", targetDate: "2026-04-18", actualDate: "", resolution: "" },
            { id: "3", summary: "Typo in footer", description: "Wrong year", priority: "low", status: "resolved", projectId: "2", assignedPersonId: "3", targetDate: "2026-04-10", actualDate: "2026-04-09", resolution: "Fixed typo" },
            { id: "4", summary: "Dark mode broken", description: "Toggle fails", priority: "medium", status: "open", projectId: "2", assignedPersonId: "4", targetDate: "2026-04-22", actualDate: "", resolution: "" },
            { id: "5", summary: "Payment timeout", description: "Takes too long", priority: "high", status: "overdue", projectId: "1", assignedPersonId: "1", targetDate: "2026-04-10", actualDate: "", resolution: "" },
            { id: "6", summary: "Images not loading", description: "Broken images", priority: "medium", status: "open", projectId: "1", assignedPersonId: "2", targetDate: "2026-04-25", actualDate: "", resolution: "" },
            { id: "7", summary: "Search broken", description: "Wrong results", priority: "medium", status: "open", projectId: "2", assignedPersonId: "3", targetDate: "2026-04-21", actualDate: "", resolution: "" },
            { id: "8", summary: "Email not sending", description: "Password reset fails", priority: "high", status: "resolved", projectId: "1", assignedPersonId: "4", targetDate: "2026-04-12", actualDate: "2026-04-11", resolution: "Fixed SMTP" },
            { id: "9", summary: "Mobile menu issue", description: "Won't collapse", priority: "low", status: "open", projectId: "2", assignedPersonId: "1", targetDate: "2026-04-30", actualDate: "", resolution: "" },
            { id: "10", summary: "Analytics missing", description: "No data shows", priority: "medium", status: "overdue", projectId: "1", assignedPersonId: "2", targetDate: "2026-04-08", actualDate: "", resolution: "" }
        ];
        saveEverything();
    }
}

// when someone calls the function will give them the entire list
function getBugs() { return allBugs; }
function getPeople() { return allPeople; }
function getProjects() { return allProjects; }

// these set of functions takes bugs, person and project 
function addBug(bug) {
    bug.id = Date.now().toString();
    allBugs.push(bug);
    saveEverything();
    return bug;
}

function addPerson(person) {
    person.id = Date.now().toString();
    allPeople.push(person);
    saveEverything();
    return person;
}

function addProject(project) {
    project.id = Date.now().toString();
    allProjects.push(project);
    saveEverything();
    return project;
}

// searches for a matching ID to find the position of a bug 
function updateBug(id, newInfo) {
    let index = allBugs.findIndex(b => b.id === id);
    // if the bug is found it updates it with new information e.g from the status being 'open' to the status being 'resolved'
    if (index !== -1) {
        allBugs[index] = { ...allBugs[index], ...newInfo };
        saveEverything();
    }
}

// creates a new list without the deleted bug
function deleteBug(id) {
    allBugs = allBugs.filter(b => b.id !== id);
    saveEverything();
}

// Helper funtions it converts ID to name (for the people that is assigned to give you assistance)
function getPersonById(id) {
    return allPeople.find(person => person.id === id);
}

function getProjectById(id) {
    return allProjects.find(project => project.id === id);
}

function getPersonName(personId) {
    if (!personId) return "Unassigned";
    let person = getPersonById(personId);
    return person ? `${person.name} ${person.surname}` : "Unknown";
}

function getProjectName(projectId) {
    if (!projectId) return "No Project";
    let project = getProjectById(projectId);
    return project ? project.name : "Unknown";
}

// makes everything available for use
window.loadEverything = loadEverything;
window.getBugs = getBugs;
window.getPeople = getPeople;
window.getProjects = getProjects;
window.addBug = addBug;
window.addPerson = addPerson;
window.addProject = addProject;
window.updateBug = updateBug;
window.deleteBug = deleteBug;
window.getPersonById = getPersonById;
window.getProjectById = getProjectById;
window.getPersonName = getPersonName;
window.getProjectName = getProjectName;
