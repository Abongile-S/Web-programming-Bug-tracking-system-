//initial load
loadEverything();
populateProjectFilter();
populatePeopleDropdown(); // NEW
populateProjectDropdown(); // NEW
countStats();
provideTable();

//=========================================================================================================
//          DASHBOARD SCRIPT - responsible for calculations,filtering, table generation and switching views for details summary
//=========================================================================================================

//counts the bugs in each category and creates the 4 summary cards(1.All bugs, 2.Open bugs, 3.resolved bugs 4.Overdue bugs) >>>uses filter() to return a new array meeting specific criteria

function countStats(){
    let bugs = allBugs;

    let openCount = allBugs.filter(b => b.status === 'open').length;
    let overDueCount = allBugs.filter(b => b.status === 'overdue').length;
    let resolvedCount = allBugs.filter(b => b.status === 'resolved').length;
    let allCount = allBugs.length;

    document.getElementById('total-bugs').textContent = allCount;
    document.getElementById('open-bugs').textContent = openCount;
    document.getElementById('resolved-bugs').textContent = resolvedCount;
    document.getElementById('overdue-bugs').textContent = overDueCount;
}

//adds one <option> element for each project in allProjects array 
function populateProjectFilter(){
    let select = document.getElementById('filter-project');

    //lops through all the projects and create option elements
    allProjects.forEach(function(project){
        let option = document.createElement('option');
        option.value = project.id;              //value used for filtering
        option.textContent = project.name;     //display text to user
        select.appendChild(option);             //adds option to dropdown list
    });
}

// reads the selected filters and narrows down the bug list based on the selcted filters and rebuilds the table rows matching the filters
function provideTable(){
    //  STEP1: read current/chosen filter values from the inputs field
    let searchText = document.getElementById('search-input').value.toLowerCase();
    let statusFilter = document.getElementById('filter-status').value;
    let priorityFilter = document.getElementById('filter-priority').value;
    let projectFilter = document.getElementById('filter-project').value;

    //STEP2: using filter() to only keep the bugs that pass the selected criteria
    let filtered = allBugs.filter(b => {
        if(searchText && !b.summary.toLowerCase().includes(searchText)) return false; //check if summary has the searched text
        if(statusFilter && b.status !== statusFilter) return false; //status filter & needs the exact match
        if(priorityFilter && b.priority !== priorityFilter) return false;
        if(projectFilter && b.projectId !== projectFilter) return false;
        return true; //if all filters match, keep that bug
    });

    //STEP 3: update result counter display
    document.getElementById('result-counter').textContent = `Showing ${filtered.length} of ${allBugs.length} issues.`;

    //STEP 4:references to the table body
   let tbody = document.getElementById('issues-tbody');
    tbody.innerHTML = "";

    //STEP 5: if  nothing matches the filters, show an error message
    if(filtered.length === 0){
        tbody.innerHTML = `
        <tr>
            <td colspan = '7'>No issues match your search.</td>
        </tr>   `;
        return;
    }
    
    //STEP 6: build one table row for each bug found that matched selected filters using the a map() method and the join() to combine them into single strings
    tbody.innerHTML = filtered.map(bug => {
        return `
        <tr onclick="viewIssue('${bug.id}')">
            <td>${bug.id}</td>

            <td>
                <strong>${bug.summary}</strong>
            </td>

            <td>
                ${getProjectName(bug.projectId)}
            </td>

            <td>
                ${getPersonName(bug.assignedPersonId)}
            </td>

            <td>
                ${bug.priority}
            </td>

            <td>
                ${bug.targetDate || "-"}
            </td>

            <td>
                ${bug.status}
            </td>
        </tr> `;
    }).join(''); 
}

//clear all selected filters and returns full table with all the issues, so basically sets all filters values to empty and refreshes the display/table with no filters applied
function resetFilters(){
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-project').value = '';
    provideTable();
}

//displays detailed view of a specific issue & hides the dashboard and shows detailed issue, shows when user clicks on any row in the dashboard table + takes a string id parameter of the issues's id
function viewIssue(id){
    //STEP 1: find the selected bug or issue by matching its id in our array
    let bug = allBugs.find(b =>  b.id === id);

    // SAFETY CHECK- if something goes wrong or if bug not found exit
    if(!bug) return;

    //STEP 3: switch views  by Hiding the dashboard, and showing detailed issue
    document.getElementById('dashboard-area').style.display = 'none';
    document.getElementById('details-section').style.display = 'block';

    //  STEP 4:to fill the details cards with all bug info and a BACK TO DASHBOARD Button that returns to dashboard view & a delete button
    document.getElementById('details-card').innerHTML = `
        <h2>Bug Details:</h2>
        <h3>(${bug.id}). ${bug.summary}</h3>
        <p><strong>Description: </strong>${bug.description}</p>
        <p><strong>Status: </strong>${bug.status}</p>
        
        <p>
        <strong>Status:</strong>
        <select onchange="changeStatus('${bug.id}', this.value)">
            <option value="open" ${bug.status === "open" ? "selected" : ""}>Open</option>
            <option value="resolved" ${bug.status === "resolved" ? "selected" : ""}>Resolved</option>
            <option value="overdue" ${bug.status === "overdue" ? "selected" : ""}>Overdue</option>
        </select>
        </p>

        <p><strong>Project: </strong>${allProjects.find(p => p.id === bug.projectId)?.name ||'Unknown'}</p>

        <p>
        <strong>Assigned To:</strong>
        <select onchange="reassignPerson('${bug.id}', this.value)">
            ${getPeople().map(person => `
            <option value="${person.id}" 
                ${person.id === bug.assignedPersonId ? "selected" : ""}>
                ${person.name} ${person.surname}
            </option>
            `).join("")}
        </select>
        </p>
        
        <p>
        <strong>Target Date:</strong>
        <input 
            type="date" 
            value="${bug.targetDate}" 
            onchange="updateDate('${bug.id}', this.value)">
        </p>
        <br>
        
        <button onclick="deleteIssue('${bug.id}')">Delete Issue</button>
        
        
        <button type="button" onclick="showDashboard()">
         &larr; Back to Dashboard
        </button>
    `;
    
}


//shows the dashboard by hiding the details section and claering the details card, called when user clicks 'Back to Dashboard' button
function showDashboard(){
    
    //hide details and show dashboard
    document.getElementById('details-section').style.display = 'none';
    document.getElementById('create-issue-section').style.display = 'none';
    document.getElementById('dashboard-area').style.display = 'block';

    //clear the details card content and hide back to dashboard button as well 
    document.getElementById('details-card').innerHTML = '';

    //refresh/bring back table and show latest data
    provideTable();

}

// Shows the create issue section and hides dashboard
//function showCreateIssue(){
  //  document.getElementById('dashboard-area').style.display = 'none';
  //  document.getElementById('create-issue-section').style.display = 'block';
//}



//===========================================================================================
//          Page run order
//=============================================================================================


// Updates only the status of an issue
function changeStatus(id, newStatus){

    updateBug(id, {
        status: newStatus
    });

    // refresh UI so dashboard updates immediately
    countStats();
    provideTable();
}

// Changes who the issue is assigned to
function reassignPerson(id, personId){

    updateBug(id, {
        assignedPersonId: personId
    });

    // optional refresh for table consistency
    provideTable();
}


// Deletes an issue
function deleteIssue(id){

    if(confirm("Are you sure you want to delete this issue?")){

        deleteBug(id);
        showDashboard();
        countStats();
        provideTable();

    }
}



// Shows create issue form
function showCreateIssue(){
    document.getElementById('dashboard-area').style.display = 'none';
    document.getElementById('create-issue-section').style.display = 'block';
}

// Creates new issue
function createIssue(){

    let issue = {
        summary: document.getElementById('issue-summary').value,
        description: document.getElementById('issue-description').value,
        priority: document.getElementById('issue-priority').value,
        projectId: document.getElementById('issue-project').value,
        assignedPersonId: document.getElementById('issue-assigned').value,
        targetDate: document.getElementById('issue-date').value,
        status: "open",
        actualDate: "",
        resolution: ""
    };

    //overdue date check
    let today = new Date().toISOString().split("T")[0];

    if (issue.targetDate < today) {
        issue.status = "overdue";
    }

    //save issue
    addBug(issue);

    // Reset form fields 
    document.getElementById("issueForm").reset();

    // Refresh dashboard data
    showDashboard();
    countStats();
    provideTable();
}

// Populate people dropdown
function populatePeopleDropdown(){

let select = document.getElementById('issue-assigned');

allPeople.forEach(person => {

let option = document.createElement('option');

option.value = person.id;
option.textContent = person.name + " " + person.surname;

select.appendChild(option);

});
}

// Populate project dropdown
function populateProjectDropdown(){

let select = document.getElementById('issue-project');

allProjects.forEach(project => {

let option = document.createElement('option');

option.value = project.id;
option.textContent = project.name;

select.appendChild(option);

});
}


window.viewIssue = viewIssue;
window.showDashboard = showDashboard;
window.showCreateIssue = showCreateIssue;
window.createIssue = createIssue;
window.deleteIssue = deleteIssue;
window.changeStatus = changeStatus;
window.reassignPerson = reassignPerson;



