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
}


/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/
var canOrder = false;
function renderDataInTheTable() {
    if(order_qty[null] != undefined)
    {
        const error = document.createElement("p");
        error.innerHTML = `You have added nothing to the cart! <a href="restaurant.html"> Click here to order</a>`;
        document.getElementById("html-cart-table").style.visibility = "hidden";
        document.getElementById("order_now").style.visibility = "hidden";
        document.body.appendChild(error);
    }
    else
    {
        document.getElementById("html-cart-table").style.visibility = "visible";
        document.getElementById("order_now").style.visibility = "visible";
        retrieveMenu()
            .then(response => response.json())
            .then(data =>{
                const mytable = document.getElementById("html-cart-table");
                const arr = data[0];
                for(let i = 0; i < arr.length; i++)
                {
                    const tuple = arr[i];
                    let qty;
                    if((qty = order_qty[parseInt(tuple["ItemID"])]) != null)
                    {
                        let newRow = document.createElement("tr");
                        let cell1 = document.createElement("td");
                        let cell2 = document.createElement("td");
                        let cell3 = document.createElement("td");

                        cell1.innerText = tuple["Name"];
                        cell2.innerText = qty;
                        cell3.innerText = "$" + tuple["Price"];

                        newRow.appendChild(cell1);
                        newRow.appendChild(cell2);
                        newRow.appendChild(cell3);

                        mytable.appendChild(newRow);
                        canOrder = true;
                    }
                }
            });
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

var order = localStorage.getItem("cart").split(",");
let order_qty = orderQtyMap(order);
function orderQtyMap(order)
{
    let map = {};
    for(let i = 0; i < order.length; i++)
    {
        if(map[order[i]] == undefined)
            map[order[i]] = 1;
        else map[order[i]]++;
    }
    return map;
}


//SESSION EVENT HANDLERS
var intid;
window.onload = () =>{
    cfss(session, false);
    if(localStorage.windowCount == '1')intid = startSessionChecker(session);
    //document.body.addEventListener("unload", cancel_session);
    renderDataInTheTable();
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("home").addEventListener('click', toHome);
    document.getElementById("order_now").addEventListener('click', orderNow);
};

function toHome()
{
    window.location = "index.html";
}

function orderNow()
{
    if(canOrder)
    {
        createOrder(name, order)
            .then(response => response.json())
            .then(data => {
                if(data["response"] == "error")
                {
                    alert("order has failed");
                }
                else
                {
                    alert(`order has been placed. ORDER ID: ${data["response"]}`);
                    localStorage.removeItem("cart");
                    order = [];
                    order_qty = {"null": 1};
                    window.location = "index.html";
                }
            });
        canOrder = false;
    }
    else
    {
        alert("You have not selected anything to order yet!");
    }
}

const createOrder = async (c_name, order) =>
{
    const response = await fetch(server + "/order/takeOrder", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        reffererPolicy: 'no-refferer',
        body: JSON.stringify({c_name: c_name, order: order.toString()})
    });

    return response;
};

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
