import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/


//SESSION EVENT HANDLERS
var session;
var userid;
var name;
var intid;
window.onload = () =>{
    const localStorage = window.localStorage;
    let tabCount = parseInt(localStorage.getItem("windowCounter"));
    tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;

    if((performance.getEntriesByType("navigation")[0].type == "reload"
    || document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/index.html"
    || document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/restaurant.html"
    ||  document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/search.html"
    ||  document.referrer == "http://127.0.0.1:5500/client/customer_app/pages/FoodifyCart.html")
    && (localStorage.getItem("tmpSID") != null && localStorage.getItem("tmpUID") != null && localStorage.getItem("tmpNAME") != null && localStorage.getItem("tmpCart") != null))
    {
        localStorage.setItem("SID", localStorage.getItem("tmpSID"));
        localStorage.setItem("UID", localStorage.getItem("tmpUID"));
        localStorage.setItem("NAME", localStorage.getItem("tmpNAME"));
        localStorage.setItem("cart", localStorage.getItem("tmpCart"));
        localStorage.removeItem("tmpSID");
        localStorage.removeItem("tmpUID");
        localStorage.removeItem("tmpNAME");
        localStorage.removeItem("tmpCart");
    }

    try {
        session = localStorage.getItem("SID");
        userid = localStorage.getItem("UID");
        name = localStorage.getItem("NAME");
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
    cfss(session, false);
    if(localStorage.windowCounter == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
};

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounter"));
    localStorage.setItem("windowCounter", --tabCount);
    if(tabCount <= 0){
        cancel_session();
        localStorage.removeItem("windowCounter");
    }
    killSessionChecker(intid);
};

function logout()
{
    cfss(session, true);
}