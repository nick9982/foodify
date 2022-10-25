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
    const request = new Request(server + "/login", JSON.stringify(data));
    
    fetch(request)
        .then()
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