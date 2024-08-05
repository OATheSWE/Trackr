

const login = "http://localhost:8000/login.php";
const signup = "http://localhost:8000/signup.php";
const getName = "http://localhost:8000/getName.php";
const fetchStudentStatus = "http://localhost:8000/fetchStudentStatus.php";
const submitSupervisor = "http://localhost:8000/submitSupervisor.php";
const autoAssignSupervisor = "http://localhost:8000/autoAssignSupervisor.php";
const fetchAssignments = "http://localhost:8000/fetchAssignments.php";
const fetchProjects = "http://localhost:8000/fetchProjects.php";
const fetchProposalFeedback = "http://localhost:8000/fetchProposalFeedback.php";
const projectUpload = "http://localhost:8000/projectUpload.php";
const submitProposals = "http://localhost:8000/submitProposals.php";




const api = {
    login,
    signup, 
    getName,
    fetchStudentStatus,
    submitSupervisor,
    autoAssignSupervisor,
    fetchAssignments,
    fetchProjects,
    fetchProposalFeedback,
    projectUpload,
    submitProposals
}

export { api };