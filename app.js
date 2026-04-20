loadEverything(); // FIRST
displayPeople(); //  show data
displayProjects(); // show data
populateDropdowns();

// CREATE PERSON

function createPerson() {
  let person = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
  };

  addPerson(person);
  displayPeople();
  populateDropdowns();
}

// DISPLAY PEOPLE

function displayPeople() {
  let people = getPeople();
  let list = document.getElementById("peopleList");

  list.innerHTML = "";

  people.forEach((p) => {
    let li = document.createElement("li");
    li.textContent = `${p.name} ${p.surname} (${p.username})`;
    list.appendChild(li);
  });
}

// CREATE PROJECT

function createProject() {
  let project = {
    name: document.getElementById("projectName").value,
  };

  addProject(project);
  displayProjects();
}

// DISPLAY PROJECTS

function displayProjects() {
  let projects = getProjects();
  let list = document.getElementById("projectList");

  list.innerHTML = "";

  projects.forEach((p) => {
    let li = document.createElement("li");
    li.textContent = p.name;
    list.appendChild(li);
  });
}

function populateDropdowns() {
  let people = getPeople();
  let projects = getProjects();

  let personSelect = document.getElementById("personDropdown");
  let projectSelect = document.getElementById("projectDropdown");

  personSelect.innerHTML = "<option value=''>Select Person</option>";
  projectSelect.innerHTML = "<option value=''>Select Project</option>";

  people.forEach((p) => {
    personSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });

  projects.forEach((p) => {
    projectSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
}

function createIssue() {
  let bug = {
    summary: document.getElementById("summary").value,
    description: document.getElementById("description").value,
    assignedPersonId: document.getElementById("personDropdown").value,
    projectId: document.getElementById("projectDropdown").value,
    priority: "medium",
    status: "open",
    targetDate: "",
    actualDate: "",
    resolution: "",
  };

  addBug(bug);
  alert("Issue created!");
}

function displayIssues() {
  let bugs = getBugs();
  let list = document.getElementById("issueList");

  list.innerHTML = "";

  bugs.forEach((bug) => {
    let li = document.createElement("li");

    let personName = getPersonName(bug.assignedPersonId);
    let projectName = getProjectName(bug.projectId);

    li.textContent = `
      ${bug.summary} 
      | Person: ${personName} 
      | Project: ${projectName} 
      | Status: ${bug.status}
    `;

    list.appendChild(li);
  });
}
