import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/
var cart = [];
if(localStorage.getItem("cart") != "null" && localStorage.getItem("cart") != null) cart = localStorage.getItem("cart").split(",");
function selectItem(evt)
{
    var itemid = itms[parseEvent(evt.currentTarget.id)];
    cart.push(itemid);
    localStorage.setItem("cart", cart);
}

function parseEvent(evt)
{
    return parseInt(evt.substring(3));
}

var itms = [];
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
                itms.push(tuple["ItemID"]);
                const parent = document.createElement("tr");
                parent.setAttribute("class", "rowStyling");

                const title = document.createElement("td");
                title.innerHTML = tuple["Name"];
                title.setAttribute("class", "menuTxtPadded");

                const prc = document.createElement("td");
                prc.innerHTML = "$" +tuple["Price"];
                prc.setAttribute("class", "menuTxt");

                const imgcont = document.createElement("td");
                const img = document.createElement("img");
                img.setAttribute('src', tuple["urlToImg"]);
                img.setAttribute('alt', tuple["Name"] + " image");
                img.setAttribute("class", "image");
            
                imgcont.appendChild(img);
                
                const btncontainer = document.createElement("td");
                btncontainer.innerHTML = `<button class="menuBtn1" id="btn${i}">Add to cart</button>`;
                //const button = document.getElementById(`btn${i}`);
                //button.addEventListener('click', selectItem(i));
                //button.setAttribute("class", "menuBtn1");
                //btncontainer.appendChild(button);

                parent.appendChild(title);
                parent.appendChild(prc);
                parent.appendChild(imgcont);
                parent.appendChild(btncontainer);

                menu.appendChild(parent);
            }

            document.body.appendChild(menu);
            menu.style.marginLeft = "auto";
            menu.style.marginRight = "auto";
            addEventToBtn();
        });

};

function addEventToBtn()
{
    for(let i = 0; i < itms.length; i++)
    {
        const btn = document.getElementById(`btn${i}`);
        btn.addEventListener('click', selectItem, false);
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
    cfss(session, false);
    if(localStorage.windowCounter == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("cartbtn").addEventListener('click', toCart);
    orderMenu();
    addEventToBtn();
};

function toCart()
{
    window.location = "FoodifyCart.html";
}

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