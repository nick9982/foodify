import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './loginscripts.js';

const server = "http://localhost:8080";

/*
RETRIEVING THE SESSION VARIABLES

*/


/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/
var canOrder = false;
let totalPrice = 0;
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
                        let price = parseInt(qty) * parseInt(tuple["Price"]);
                        totalPrice+=price;
                        cell3.innerText = "$" + price;

                        newRow.appendChild(cell1);
                        newRow.appendChild(cell2);
                        newRow.appendChild(cell3);

                        mytable.appendChild(newRow);
                        canOrder = true;
                    }
                }
                const total_price = document.createElement("p");
                total_price.innerHTML = `Total price: \$${totalPrice}`;
                total_price.style.textAlign = "center";
                const par = document.getElementById("totalp");
                par.appendChild(total_price);
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

let order_qty;
//SESSION EVENT HANDLERS
var intid;
var session;
var userid;
var name;
var order = [null];
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
    if(localStorage.getItem("cart") != null && localStorage.getItem("cart") != "null"){
        order = localStorage.getItem("cart").split(",");
    }
    order_qty = orderQtyMap(order);
    cfss(session, false);
    if(localStorage.windowCounter == '1')intid = startSessionChecker(session);
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
                    alert(`order has been placed. ORDER ID: ${data["response"]}\nThe price was: \$${totalPrice}`);
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
