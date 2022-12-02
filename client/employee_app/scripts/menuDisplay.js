import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './FoodifyScript.js';

const server = "http://localhost:8080";
/*
RETRIEVING THE SESSION VARIABLES

*/
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/

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

function menu()
{
    const body = document.body;
    retrieveMenu()
        .then(response => response.json())
        .then(data => {
            const arr = data[0];
            for (let i = 0; i < arr.length; i++)
            {
                const tuple = arr[i];
                const parent = document.createElement("p");
                parent.style.textAlign = 'center';

                const title = document.createElement("h3");
                title.innerHTML = tuple["Name"] + " <br>$" + tuple["Price"];

                const img = document.createElement("img");
                img.setAttribute('src', tuple["urlToImg"]);
                img.setAttribute('alt', tuple["Name"] + " image");
                img.className = 'menuImage'

                const button = document.createElement("button");
                button.onclick = addItem();
                button.innerText = 'Edit item';

                parent.appendChild(img);
                parent.appendChild(title);
                parent.appendChild(button);

                body.appendChild(parent);
            }
            var head = document.getElementsByTagName('HEAD')[0];

            var link = document.createElement('link');
            
            link.rel = 'stylesheets';
            link.type = 'text/css';
            link.href = 'style.css';

            head.appendChild(link);
        });
}

// Add item to menu with which item id is added
function addItem() {

}


//SESSION EVENT HANDLERS
var session;
var userid;
var name;
var intid;
window.onload = () =>{
    const localStorage = window.localStorage;
    let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
    tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;
    if((performance.getEntriesByType("navigation")[0].type == "reload"
    || document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyOrderQueue.html"
    || document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyMenu.html")
    && (localStorage.getItem("tmpeSID") != null && localStorage.getItem("tmpeUID") != null && localStorage.getItem("tmpeNAME") != null))
    {
        localStorage.setItem("eSID", localStorage.getItem("tmpeSID"));
        localStorage.setItem("eUID", localStorage.getItem("tmpeUID"));
        localStorage.setItem("eNAME", localStorage.getItem("tmpeNAME"));
        localStorage.removeItem("tmpeSID");
        localStorage.removeItem("tmpeUID");
        localStorage.removeItem("tmpeNAME");
    }

    try {
        session = localStorage.getItem("eSID");
        userid = localStorage.getItem("eUID");
        name = localStorage.getItem("eNAME");
    } catch(e)
    {
        window.location = "FoodifyLoginPage.html";
    }
    if(session == null || userid == null || name == null)
    {
        window.location = "FoodifyLoginPage.html";
    }
    else
    {    
        localStorage.setItem("windowCounterEmp", tabCount.toString());
    }
    cfss(session, false);
    if(localStorage.windowCounterEmp == '1')intid = startSessionChecker(session);
    menu();
    document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
};

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
    localStorage.setItem("windowCounterEmp", --tabCount);
    if(tabCount <= 0)
    {
        cancel_session();
        localStorage.removeItem("windowCounterEmp");
    }
    killSessionChecker(intid);
};

function logout()
{
    cfss(session, true);
    window.location = "FoodifyLoginPage.html";
}