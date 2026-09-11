let statusChart = null;
let companyChart = null;


function updateCharts() {

    const statusCanvas =
        document.getElementById("statusChart");

    const companyCanvas =
        document.getElementById("companyChart");


    if (!statusCanvas || !companyCanvas) {

        console.error(
            "Chart canvas elements were not found."
        );

        return;
    }


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    if (statusChart) {
        statusChart.destroy();
    }


    if (companyChart) {
        companyChart.destroy();
    }


    // ================================
    // STATUS DATA
    // ================================

    const statusCounts = {

        Applied: 0,
        Interview: 0,
        Selected: 0,
        Rejected: 0

    };


    applications.forEach(function(application) {

        if (
            statusCounts.hasOwnProperty(
                application.status
            )
        ) {

            statusCounts[application.status]++;

        }

    });


    // ================================
    // STATUS CHART
    // ================================

    statusChart = new Chart(
        statusCanvas,
        {

            type: "doughnut",

            data: {

                labels: [
                    "Applied",
                    "Interview",
                    "Selected",
                    "Rejected"
                ],

                datasets: [

                    {
                        data: [
                            statusCounts.Applied,
                            statusCounts.Interview,
                            statusCounts.Selected,
                            statusCounts.Rejected
                        ]
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }
    );


    // ================================
    // COMPANY DATA
    // ================================

    const companyCounts = {};


    applications.forEach(function(application) {

        const company =
            application.company;


        if (companyCounts[company]) {

            companyCounts[company]++;

        }
        else {

            companyCounts[company] = 1;

        }

    });


    const companies =
        Object.keys(companyCounts);

    const counts =
        Object.values(companyCounts);


    // ================================
    // COMPANY CHART
    // ================================

    companyChart = new Chart(
        companyCanvas,
        {

            type: "bar",

            data: {

                labels: companies,

                datasets: [

                    {
                        label: "Applications",
                        data: counts
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            stepSize: 1

                        }
                    }
                }
            }
        }
    );
}
// ========================================
// INITIALIZE
// ========================================
document.addEventListener(
    "DOMContentLoaded",
    function() {
        updateCharts();
    }
);