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
/*const localStorage = window.localStorage;
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
    localStorage.setItem("cart", localStorage.getItem("tmpCart"));
    localStorage.removeItem("tmpSID");
    localStorage.removeItem("tmpUID");
    localStorage.removeItem("tmpNAME");
    localStorage.removeItem("tmpCart");
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
}*/

/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/


//SESSION EVENT HANDLERS
var intid;
var session;
var userid;
var name;
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
    cfss(session, false);
    if(localStorage.windowCounter == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("cartbtn").addEventListener('click', toCart);
};

function toCart()
{
    window.location = "FoodifyCart.html";
}

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounter"));
    localStorage.setItem("windowCounter", --tabCount);
    if(tabCount <= 0) {
        cancel_session();
        localStorage.removeItem("windowCounter");
    };
    killSessionChecker(intid);
};
function logout()
{
    cfss(session, true);
}