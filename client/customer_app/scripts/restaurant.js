import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/
try {
    var session = localStorage.getItem("SID");
    var userid = localStorage.getItem("UID");
    var name = localStorage.getItem("NAME");
} catch(e)
{
    window.location = "login.html";
}
if(session == null || userid == null || name == null) window.location = "login.html";
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/



//SESSION EVENT HANDLERS
var intid;
window.onload = () =>{
    cfss(session, false);
    intid = startSessionChecker(session);
    document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("cartbtn").addEventListener('click', toCart);
};

function toCart()
{
    window.location = "FoodifyCart.html";
}

window.onbeforeunload = function(){
    killSessionChecker(intid);
};
function logout()
{
    cfss(session, true);
}