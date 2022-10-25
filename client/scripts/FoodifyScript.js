// this doesnt work
//$(document).ready(function(){
//    $("#div1").fadeIn();
//    $("#div1").animate({down: '50px'});

//});

const server = "http://localhost:8080"
function validate() {
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;

    // Connect with backend here to validate user
    let data = {
        Username: username,
        Password: password
    };
    let xhr = new XMLHttpRequest();
    xhr.open("GET", server + "/login");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function ()
    {
        if(xhr.readyState === 4)
        {
            console.log("runs");
            let res = JSON.parse(xhr.responseText);
            alert(res["Error"]);
            if(res["Error"] == "login successful") window.open("FoodifyMenu.html")
            else window.open("FoodifyLoginPage.html"); 
        }
    }
    xhr.send(JSON.stringify(data));
}

function register() {
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;
    // Connect with backend to create new account

    alert("new account created");
}

// Add item to menu with which item id is added
function addItem() {

}

// Logout 
function logout() {

}