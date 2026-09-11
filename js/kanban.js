const kanbanColumns=document.querySelectorAll(".kanban-column");
function renderKanban() {
    const columnIds = {
        Applied: "appliedColumn",
        Interview: "interviewColumn",
        Selected: "selectedColumn",
        Rejected: "rejectedColumn"
    };
    const countIds = {
        Applied: "kanbanAppliedCount",
        Interview: "kanbanInterviewCount",
        Selected: "kanbanSelectedCount",
        Rejected: "kanbanRejectedCount"
    };
    // Clear columns
    Object.values(columnIds).forEach(function(id) {
        document.getElementById(id).innerHTML = "";
    });
    // Render applications
    applications.forEach(function(application, index) {
        const column =
            document.getElementById(
                columnIds[application.status]
            );
        if (!column) {
            return;
        }
        const card =
            createKanbanCard(
                application,
                index
            );
        column.appendChild(card);
    });
    // Update counts
    Object.keys(columnIds).forEach(function(status) {
        const count = applications.filter(function(application) {
                return application.status === status;
            }).length;
        document.getElementById(
            countIds[status]
        ).textContent = count;
    });
    // Empty columns
    Object.values(columnIds).forEach(function(id) {
        const column =document.getElementById(id);
        if (column.children.length === 0) {
            column.innerHTML = `
                <div class="empty-column">
                    Drop applications here
                </div>
            `;
        }
    });
}
function createKanbanCard(application, index) {
    const card =
        document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.dataset.index = index;
    card.innerHTML = `
        <h4>
            ${application.company}
        </h4>
        <p>
            ${application.position}
        </p>
        <span class="kanban-date">
            ${application.date}
        </span>
    `;
    card.addEventListener(
        "dragstart",
        handleDragStart
    );
    card.addEventListener(
        "dragend",
        handleDragEnd
    );
    return card;
}
function handleDragStart(event){
    const card=event.currentTarget;
    card.classList.add("dragging");
    event.dataTransfer.setData("text/plain",card.dataset.index);
}
function handleDragEnd(event){
    event.currentTarget.classList.remove("dragging");
}

function handleDragOver(event){
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
}
function handleDragLeave(event){
    event.currentTarget.classList.remove("drag-over");
}
function handleDrop(event) {
    event.preventDefault();
    const column =
        event.currentTarget;
    column.classList.remove(
        "drag-over"
    );
    const index =
        Number(
            event.dataTransfer.getData(
                "text/plain"
            )
        );
    const newStatus =
        column.dataset.status;
    if (
        !applications[index]
    ) {
        return;
    }
    applications[index].status =
        newStatus;
    saveApplications();
    displayApplications();
    updateStatistics();
    updateCharts();
    renderKanban();
}
kanbanColumns.forEach(function(column) {
    column.addEventListener(
        "dragover",
        handleDragOver
    );
    column.addEventListener(
        "dragleave",
        handleDragLeave
    );
    column.addEventListener(
        "drop",
        handleDrop
    );
});
document.addEventListener("DOMContentLoaded",function(){
    renderKanban();
})