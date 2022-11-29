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
var hasBeenDeclared = false;
const orderMenu = () =>
{
    retrieveMenu()
        .then(response => response.json())
        .then(data =>{
            const arr = data[0];
            const menu = document.createElement("table");

            for(let i = 0; i < arr.length; i++)
            {
                const tuple = arr[i];
                const parent = document.createElement("tr");

                const title = document.createElement("td");
                title.innerHTML = tuple["Name"];

                const prc = document.createElement("td");
                prc.innerHTML = tuple["Price"] + " $";

                const imgcont = document.createElement("td");
                const img = document.createElement("img");
                img.setAttribute('src', tuple["urlToImg"]);
                img.setAttribute('alt', tuple["Name"] + " image");
                img.setAttribute("class", "menuBtn1");
                imgcont.appendChild(img);
                
                const btncontainer = document.createElement("td");
                const button = document.createElement("button");
                button.onclick = selectItem(i);
                button.setAttribute("class", "menuBtn1");
                btncontainer.appendChild(button);

                parent.appendChild(title);
                parent.appendChild(prc);
                parent.appendChild(imgcont);
                parent.appendChild(btncontainer);

                menu.appendChild(parent);
            }
            document.body.appendChild(menu);
            menu.style.align = "center";
        });
        hasBeenDeclared = true;


};


function selectItem(i)
{
    if(hasBeenDeclared)
    {
        console.log(i);
    }
}

const retrieveMenu = async () =>
{
    const response = await fetch(server + "/view_menu", {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        reffererPolicy: 'no-refferer'
    });

    return response;
};

//SESSION EVENT HANDLERS
var intid;
window.onload = () =>{
    cfss(session, false);
    if(localStorage.windowCount == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("cartbtn").addEventListener('click', toCart);
    orderMenu();
};

function toCart()
{
    window.location = "FoodifyCart.html";
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