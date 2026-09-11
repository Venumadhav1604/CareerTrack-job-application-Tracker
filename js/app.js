// ========================================
// JOB APPLICATION DATA
// ========================================
let applications = [];
// ========================================
// EDITING INDEX
// ========================================
// null = adding a new application
// number = editing an existing application
let editingIndex = null;
// ========================================
// DOM ELEMENTS
// ========================================
const applicationList =
    document.getElementById("applicationList");
const addJobBtn =
    document.getElementById("addJobBtn");
const applicationFormContainer =
    document.getElementById("applicationFormContainer");
const applicationForm =
    document.getElementById("applicationForm");
const cancelBtn =
    document.getElementById("cancelBtn");
// ========================================
// DISPLAY APPLICATIONS
// ========================================
function displayApplications() {
    applicationList.innerHTML = "";
    const filteredApplications =
        getFilteredApplications();
    filteredApplications.forEach(function(application) {
        const originalIndex =
            applications.indexOf(application);
        const card =
            document.createElement("div");
        card.classList.add("application-card");
        card.innerHTML = `
            <h3>${application.company}</h3>
            <p>${application.position}</p>
            <span class="status status-${application.status.toLowerCase()}">
                ${application.status}
            </span>
            <p>${application.date}</p>
            <div class="card-buttons">
                <button
                    class="edit-btn"
                    onclick="editApplication(${originalIndex})">
                    Edit
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteApplication(${originalIndex})">
                    Delete
                </button>
            </div>
        `;
        applicationList.appendChild(card);
    });
    // No results message
    if (filteredApplications.length === 0) {
        applicationList.innerHTML = `
            <p class="no-results">
                No applications found.
            </p>
        `;
    }
}
// ========================================
// UPDATE STATISTICS
// ========================================
function updateStatistics() {
    const total = applications.length;
    const applied = applications.filter(function(application) {
        return application.status === "Applied";
    }).length;
    const interviews = applications.filter(function(application) {
        return application.status === "Interview";
    }).length;
    const selected = applications.filter(function(application) {
        return application.status === "Selected";
    }).length;
    const rejected = applications.filter(function(application) {
        return application.status === "Rejected";
    }).length;
    const interviewRate =
        total > 0
            ? ((interviews / total) * 100).toFixed(1)
            : 0;
    const selectionRate =
        total > 0
            ? ((selected / total) * 100).toFixed(1)
            : 0;
    const rejectionRate =
        total > 0
            ? ((rejected / total) * 100).toFixed(1)
            : 0;
    document.getElementById("totalApplications").textContent =
        total;
    document.getElementById("interviews").textContent =
        interviews;
    document.getElementById("selected").textContent =
        selected;
    document.getElementById("rejected").textContent =
        rejected;
    document.getElementById("interviewRate").textContent =
        interviewRate + "%";
    document.getElementById("selectionRate").textContent =
        selectionRate + "%";
    document.getElementById("rejectionRate").textContent =
        rejectionRate + "%";
    document.getElementById("applicationsSent").textContent =
        total;
    document.getElementById("appliedCount").textContent =
        applied;
    document.getElementById("interviewCount").textContent =
        interviews;
    document.getElementById("selectedCount").textContent =
        selected;  
    document.getElementById("rejectedCount").textContent =
        rejected;  
}
// ========================================
// OPEN APPLICATION FORM
// ========================================
addJobBtn.addEventListener("click", function() {
    editingIndex = null;
    applicationForm.reset();
    applicationFormContainer.classList.add("active");
});
// ========================================
// CANCEL FORM
// ========================================
cancelBtn.addEventListener("click", function() {
    applicationForm.reset();
    applicationFormContainer.classList.remove("active");
    editingIndex = null;
});
// ========================================
// FORM SUBMISSION
// ========================================
applicationForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        // Validate form
        if (!validateForm()) {
            return;
        }
        const company =
            companyInput.value.trim();
        const position =
            positionInput.value.trim();
        const status =
            statusInput.value;
        const date =
            dateInput.value;
        // Check duplicate
        if (
            editingIndex === null &&
            isDuplicateApplication(
                company,
                position
            )
        ) {
            showError(
                companyInput,
                companyError,
                "This application already exists."
            );
            return;
        }
        const wasEditing =
            editingIndex !== null;
        const applicationData = {
            company,
            position,
            status,
            date
        };
        // Update
        if (editingIndex !== null) {
            applications[editingIndex] =
                applicationData;
        }
        // Create
        else {
            applications.push(
                applicationData
            );
        }
        // Save
        saveApplications();
        // Update UI
        displayApplications();
        updateStatistics();
        updateCharts();
        renderKanban();
        // Success message
        successMessage.textContent =
            wasEditing
                ? "Application updated successfully!"
                : "Application added successfully!";
        successMessage.classList.add("show");
        // Reset
        applicationForm.reset();
        applicationFormContainer
            .classList.remove("active");
        editingIndex = null;
        // Hide success message
        setTimeout(function() {
            successMessage.classList.remove("show");
        }, 3000);
    }
);
// ========================================
// DELETE APPLICATION
// ========================================
function deleteApplication(index) {
    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );
    if (!confirmed) {
        return;
    }
    applications.splice(index, 1);
    saveApplications();
    displayApplications();
    updateStatistics();
    updateCharts();
    renderKanban();
}
// ========================================
// EDIT APPLICATION
// ========================================
function editApplication(index) {
    editingIndex = index;
    const application =
        applications[index];
    document.getElementById("company").value =
        application.company;
    document.getElementById("position").value =
        application.position;
    document.getElementById("status").value =
        application.status;
    document.getElementById("date").value =
        application.date;
    applicationFormContainer.classList.add("active");
    renderKanban();

}

//=====================================================
//  SEARCH AND FILTER
//=====================================================
const searchInput=document.getElementById("searchInput");
const statusFilter=document.getElementById("statusFilter");
const sortFilter=document.getElementById("sortFilter");
//===================================================
//FILTER APPLICATIONS
//===================================================
function getFilteredApplications(){
    let filteredApplications=[...applications];
    //search
    const searchTerm=searchInput.value.toLowerCase().trim();
    if (searchTerm!==""){
        filteredApplications = filteredApplications.filter(function(application){
            return (application.company.toLowerCase().includes(searchTerm) || application.position.toLowerCase().includes(searchTerm));
        });
    }
    // status filter
    const selectedStatus=statusFilter.value;
    if (selectedStatus!=="All"){
        filteredApplications=filteredApplications.filter(function(application){
            return application.status===selectedStatus;
        });
    }
    return sortApplications(filteredApplications);
}
//=======================================
// SEARCH EVENT
//========================================
searchInput.addEventListener("input",function(){
    displayApplications();
});

//=========================================
//  STATUS FILTER EVENT
//=========================================
statusFilter.addEventListener("change",function(){
    displayApplications();
});

//==============================================
// SORT APPLICATIONS
//=============================================
function sortApplications(applicationList){
    const sortOption=sortFilter.value;
    if (sortOption==="newest"){
        applicationList.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });
    }
    else if(sortOption==="oldest"){
        applicationList.sort(function(a,b){
            return new Date(a.date) - new Date(b.date);
        });
    }
    else if(sortOption==="company"){
        applicationList.sort(function(a,b){
            return a.company.localeCompare(b.company);
        });
    }
    else if(sortOption==="position"){
        applicationList.sort(function(a,b){
            return a.position.localeCompare(b.position);
        });
    }
    return applicationList;
}
//==========================================
// SORT EVENT
//==========================================
sortFilter.addEventListener("change",function(){
    displayApplications();
});

//============================================
//  SAVE APPLICATIONS
//============================================
function saveApplications(){
    localStorage.setItem("applications",JSON.stringify(applications));
}
//=======================================
// LOAD APPLICATIONS
//=======================================
function loadApplications(){
    const savedApplications=localStorage.getItem("applications");
    if (savedApplications){
        applications=JSON.parse(savedApplications);
    }
}
const themeToggle=document.getElementById("themeToggle");
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode =
        document.body.classList.contains("dark-mode");
    if (isDarkMode) {
        themeToggle.textContent = "☀️ Light Mode";
    }
    else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
    saveTheme();
}
function saveTheme(){
    const isDarkMode=document.body.classList.contains("dark-mode");
    localStorage.setItem("theme",isDarkMode ? "dark" : "light");
}
function loadTheme(){
    const savedTheme=localStorage.getItem("theme");
    if (savedTheme==="dark"){
        document.body.classList.add("dark-mode");
        themeToggle.textContent="☀️ Light Mode";
    }
    else{
        themeToggle.textContent="🌙 Dark Mode"
    }
}
themeToggle.addEventListener("click",function(){
    toggleTheme();
});
const companyInput =
    document.getElementById("company");
const positionInput =
    document.getElementById("position");
const statusInput =
    document.getElementById("status");
const dateInput =
    document.getElementById("date");
const companyError =
    document.getElementById("companyError");
const positionError =
    document.getElementById("positionError");
const statusError =
    document.getElementById("statusError");
const dateError =
    document.getElementById("dateError");
const successMessage =
    document.getElementById("successMessage");
companyInput.addEventListener("input",validateCompany);
positionInput.addEventListener("input",validatePosition);
statusInput.addEventListener("change",validateStatus);
dateInput.addEventListener("change",validateDate);
function showError(input,errorElement,message){
    input.classList.add("input-error");
    errorElement.textContent=message;
}
function clearError(input,errorElement){
    input.classList.remove("input-error");
    errorElement.textContent="";
}
function validateCompany(){
    const company=companyInput.value.trim();
    if (company===""){
        showError(companyInput,companyError,"Company name is required.");
        return false;
    }
    if (company.length<2){
        showError(companyInput,companyError,"Company name must be atleast 2 characters.");
        return false;
    }
    clearError(companyInput,companyError);
    return true;
}
function validatePosition(){
    const position=positionInput.value.trim();
    if (position===""){
        showError(positionInput,positionError,"Job position is required.");
        return false;
    }
    if (position.length<2){
        showError(positionInput,positionError,"Position must be atleast 2 characters.");
        return false;
    }
    clearError(positionInput,positionError);
    return true;
}
function validateStatus(){
    const status=statusInput.value;
    if (status===""){
        showError(statusInput,statusError,"Please select an application status.");
        return false;
    }
    clearError(statusInput,statusError);
    return true;
}
function validateDate() {
    const selectedDate =
        dateInput.value;
    if (selectedDate === "") {
        showError(
            dateInput,
            dateError,
            "Application date is required."
        );
        return false;
    }
    const today =
        new Date().toISOString().split("T")[0];
        dateInput.max=today;
    if (selectedDate > today) {
        showError(
            dateInput,
            dateError,
            "Application date cannot be in the future."
        );
        return false;
    }
    clearError(dateInput,dateError);
    return true;
}
function validateForm() {
    const companyValid =
        validateCompany();
    const positionValid =
        validatePosition();
    const statusValid =
        validateStatus();
    const dateValid =
        validateDate();
    return (
        companyValid &&
        positionValid &&
        statusValid &&
        dateValid
    );
}
function isDuplicateApplication(company,position){
    return applications.some(function(application){
        return(
            application.company.toLowerCase()===company.toLowerCase() && application.position.toLowerCase()===position.toLowerCase()
        );
    });
}
// ========================================
// START APPLICATION
// ========================================
loadTheme();
loadApplications();
displayApplications();
updateStatistics();