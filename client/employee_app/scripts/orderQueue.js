import {startSessionChecker, killSessionChecker, cfss, cancel_session} from './FoodifyScript.js';

const server = "http://localhost:8080";
/*
RETRIEVING THE SESSION VARIABLES

*/
const localStorage = window.localStorage;
let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
tabCount = Number.isNaN(tabCount) ? 1 : ++tabCount;

if(performance.getEntriesByType("navigation")[0].type == "reload"
|| document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyOrderQueue.html"
|| document.referrer == "http://127.0.0.1:5500/client/employee_app/pages/FoodifyMenu.html")
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
/*
END OF RETREIVING AND SETTING SESSION VARIABLES
*/
const retrieveOrders = async () =>
{
    const response = await fetch(server + "/order/allOrders", {
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
let orders = [];
const displayOrders = () =>
{
    retrieveOrders()
        .then(response => response.json())
        .then(data =>{
            var menuItems = {};
            retrieveMenu()
                .then(response => response.json())
                .then(data1 =>
                    {
                        const arr_ = data1[0];
                        for(let i = 0; i < arr_.length; i++)
                        {
                            menuItems[arr_[i]["ITEMID"]] = arr_[i]["NAME"];
                        }
                        let arr = data[0];
                        const table = document.getElementById("html-cart-table");
                        for(let i = 0; i < arr.length; i++)
                        {
                            const tuple = arr[i];
                            const parent = document.createElement("tr");
                            let order = arr[i]["ORDER_DETAILS"].split(",");
                            let map = {};
                            for(let j = 0; j < order.length; j++)
                            {
                                if(map[order[j]] == undefined)
                                    map[order[j]] = 1;
                                else map[order[j]]++;
                            }
                            orders.push(tuple["ORDER_ID"]);
                            const cell1 = document.createElement("td");
                            const cell2 = document.createElement("td");
                            const cell3 = document.createElement("td");
                            const cell4 = document.createElement("td");

                            cell1.innerHTML = tuple["ORDER_ID"];
                            cell2.innerHTML = tuple["C_NAME"];
                            //put table in cell 3 wiht name and qty
                            const mytable = document.createElement("table");
                            for(let x = 0; x < arr_.length; x++)
                            {
                                const row = arr_[x];
                                let qty;
                                if((qty = map[parseInt(row["ItemID"])]) != null)
                                {
                                    let newRow = document.createElement("tr");
                                    let cell1 = document.createElement("td");
                                    let cell2 = document.createElement("td");

                                    cell1.innerText = row["Name"];
                                    cell2.innerText = qty;

                                    newRow.appendChild(cell1);
                                    newRow.appendChild(cell2);

                                    mytable.appendChild(newRow);
                                }
                            }
                            cell3.appendChild(mytable);
                            cell4.innerHTML = `<button id="btn${i}">Order completed</button>`;
                            
                            parent.appendChild(cell1);
                            parent.appendChild(cell2);
                            parent.appendChild(cell3);
                            parent.appendChild(cell4);
                            table.appendChild(parent);
                        }
                        addEventToBtn();
                    });
        });
};

function removeItem(evt)
{
    console.log("aclled");
    var orderid = orders[parseEvent(evt.currentTarget.id)];
    remove_order(orderid)
        .then(function(){
            window.location = "FoodifyOrderQueue.html";
        })
}

const remove_order = async (id) =>
{
    const response = await fetch(server + "/remove_order", {
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
        body: JSON.stringify({orderid: id})
    });

    return response;
};

function addEventToBtn()
{
    for(let i = 0; i < orders.length; i++)
    {
        const btn = document.getElementById(`btn${i}`);
        btn.addEventListener('click', removeItem, false);
    }
}

function parseEvent(evt)
{
    return parseInt(evt.substring(3));
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
    if(localStorage.windowCount == '1') intid = startSessionChecker(session);
    document.body.addEventListener("unload", cancel_session);
    document.getElementById("logout").addEventListener('click', logout);
    document.getElementById("home").addEventListener('click', to_home);
    displayOrders();
};

function to_home()
{
    window.location = "FoodifyMenu.html";
}

window.onbeforeunload = function(){
    let tabCount = parseInt(localStorage.getItem("windowCounterEmp"));
    localStorage.setItem("windowCounterEmp", --tabCount);
    if(tabCount == 0) cancel_session();
    killSessionChecker(intid);
};

function logout()
{
    cfss(session, true);
    window.location = "FoodifyLoginPage.html";
}