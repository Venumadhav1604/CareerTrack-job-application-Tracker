const loadApiData=document.getElementById("loadApiData");
const apiStatus=document.getElementById("apiStatus");
const apiJobs=document.getElementById("apiJobs");

//=============================================
// DISPLAY API JOBS
//=============================================
function displayApiJobs(jobs){
    apiJobs.innerHTML="";
    jobs.slice(0,5).forEach(function(job){
        const card=document.createElement("div");
        card.className="api-job-card";
        card.innerHTML=`<h3>Job #${job.id} </h3>
                        <p>${job.title}</p>
                        <small>Fetched from API</small>`;
        apiJobs.appendChild(card);
    });
}

//============================================
// LOAD JOBS
//============================================
async function loadJobs() {
    apiStatus.textContent = "Loading jobs...";
    try {
        const fetchRequest = fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );
        const timeout = new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("Request timed out"));
            }, 5000);
        });
        const response = await Promise.race([
            fetchRequest,
            timeout
        ]);
        if (!response.ok) {
            throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        displayApiJobs(data);
        apiStatus.textContent =
            "Jobs loaded successfully.";
    }
    catch (error) {
        console.error("API Error:", error);
        apiStatus.textContent =
            "Unable to load jobs. Please check your internet connection.";
    }
}
loadApiData.addEventListener("click",loadJobs);
