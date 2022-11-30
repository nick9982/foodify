import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './FoodifyScript.js';

const server = "http://localhost:8080";
/*
RETRIEVING THE SESSION VARIABLES

*/
const localStorage = window.localStorage;
let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;

if(performance.getEntriesByType("navigation")[0].type == "reload"
|| document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyOrderQueue.html"
|| document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyMenu.html")
{
    localStorage.setItem("SID", localStorage.getItem("tmpSID"));
    localStorage.setItem("UID", localStorage.getItem("tmpUID"));
    localStorage.setItem("NAME", localStorage.getItem("tmpNAME"));
    localStorage.removeItem("tmpSID");
    localStorage.removeItem("tmpUID");
    localStorage.removeItem("tmpNAME");
}

try {
    var session = localStorage.getItem("SID");
    var userid = localStorage.getItem("UID");
    var name = localStorage.getItem("NAME");
} catch(e)
{
    console.log("catch");
    //window.location = "FoodifyLoginPage.html";
}
if(session == null || userid == null || name == null)
{
    console.log(session);
    //window.location = "FoodifyLoginPage.html";
}
else
{    
    localStorage.setItem("windowCounterEmp", tabCount.toString());
}
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/


//SESSION EVENT HANDLERS
var intid;
window.onload = () =>{
    //cfss(session, false);
    //intid = startSessionChecker(session);
    document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("home").addEventListener('click', to_home);
};

function to_home()
{
    window.location = "FoodifyMenu.html";
}

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
    localStorage.setItem("windowCounterEmp", --tabCount);
    if(tabCount == 0) cancel_session();
    killSessionChecker(intid);
};

function logout()
{
    cfss(session, true);
}