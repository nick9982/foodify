import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/
const localStorage = window.localStorage;
let tabCount = parseInt(localStorage.getItem("windowCounter"));
tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;

if(performance.getEntriesByType("navigation")[0].type == "reload"
|| document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/index.html"
|| document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/restaurant.html"
||  document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/search.html"
||  document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/FoodifyCart.html")
{
    localStorage.setItem("SID", localStorage.getItem("tmpSID"));
    localStorage.setItem("UID", localStorage.getItem("tmpUID"));
    localStorage.setItem("NAME", localStorage.getItem("tmpNAME"));
}

try {
    var session = localStorage.getItem("SID");
    var userid = localStorage.getItem("UID");
    var name = localStorage.getItem("NAME");
    localStorage.removeItem("tmpSID");
    localStorage.removeItem("tmpUID");
    localStorage.removeItem("tmpNAME");
} catch(e)
{
    window.location = "login.html";
}
if(session == null || userid == null || name == null)
{
    window.location = "login.html";
}
else
{    
    localStorage.setItem("windowCounter", tabCount.toString());
}


/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/


//SESSION EVENT HANDLERS
var intid;
window.onload = () =>{
    cfss(session, false);
    if(localStorage.windowCount == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("home").addEventListener('click', toHome);
};

function toHome()
{
    window.location = "index.html";
}

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounter"));
    localStorage.setItem("windowCounter", --tabCount);
    if(tabCount == 0) cancel_session();
    killSessionChecker(intid);
};

function logout()
{
    cfss(session, true);
}
