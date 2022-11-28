import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './FoodifyScript.js';

const server = "http://localhost:8080";
/*
RETRIEVING THE SESSION VARIABLES

*/
function parseCookie(inp)
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
let decCookie = decodeURIComponent(document.cookie);

let info = parseCookie(decCookie);
if(info.length == 0)
    window.location = "FoodifyLoginPage.html";

const session = info["SID"];
const userid = info["UID"];
const name = info["NAME"];

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
                button.innerText = 'Add Item';

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

var intid;
window.onload = () =>{
    cfss(session, false);
    intid = startSessionChecker(session);
    menu();
    document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
};

window.onbeforeunload = function(){
    killSessionChecker(intid);
};
function logout()
{
    cfss(session, true);
}