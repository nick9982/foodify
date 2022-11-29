import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/
/*function parseCookie(inp)
{
    if(inp == '') return {};
    let ca = inp.split(';');
    let dict = {};
    for(let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while(c.charAt(0) == ' ')
        {
            c= c.substring(1);
        }
        let len = 0;
        while(c.charAt(len) != '=')
        {
            len++;
        }
        dict[c.substring(0, len)] = c.substring(len+1);
    }
    return dict;
}
let decCookie = decodeURIComponent(document.cookie);*/

/*let info = parseCookie(decCookie);
if(info.length == 0)
    window.location = "FoodifyLoginPage.html";*/
const localStorage = window.localStorage;

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