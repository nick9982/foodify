// this doesnt work
$(document).ready(function(){
    $("#div1").fadeIn();
    $("#div1").animate({down: '50px'});
});

function validate() {
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;
    // Connect with backend here to validate user
    
    // Temp data
    if(username=="admin" && password=="user") {
        alert("Login successful.");
        window.open("FoodifyMenu.html");
    } else {
        alert("Login failed.");
    }
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