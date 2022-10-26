// this doesnt work
//$(document).ready(function(){
//    $("#div1").fadeIn();
//    $("#div1").animate({down: '50px'});

//});

const server = "http://localhost:8080";

function validate()
{
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;

    if(username == '' || password == '') alert("All fields required");
    else
    {
        let data = {
            Username: username,
            Password: password
        };

        login(data)
            .then(response => response.json())
            .then(data => {
                alert(data["Error"]);
                if(data["Error"] == "Authentication failed") window.location = "FoodifyLoginPage.html";
                else window.location = "FoodifyMenu.html";
            });
    }

}

const login = async (data) =>
{
    const response = await fetch(server + "/login", {
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
        body: JSON.stringify(data)
    });

    return response;
};

function register() {
    var name = document.getElementById("NM").value;
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;
    var re_enteredPassword = document.getElementById("RPW").value;
    const buttons = document.getElementsByClassName("radiobtn");
    var role = '';
    if(buttons[0].checked) role = "Employee";
    if(buttons[1].checked) role = "Manager";
    
    if(name == '' || username == '' || password == '' || re_enteredPassword == '' || role == '')
    {
        alert('All fields required');
    }
    else
    {
        // Connect with backend to create new account
        let data = {
            Username: username,
            Password: password,
            Re_enteredPassword: re_enteredPassword,
            Name: name,
            Employee_type: role
        };

        create_acc(data)
            .then(response => response.json())
            .then(data => {
                alert(data["Error"]);
                if(data["Error"] == "Account created successfully") window.location = 'FoodifyLoginPage.html';
            });
    }
}

const create_acc = async (data) =>
{
    const response = await fetch(server + "/create_account", {
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
        body: JSON.stringify(data)
    });

    return response;
};

function toRegPage()
{
    window.location = "FoodifyRegisterPage.html";
}

// Logout 
function logout() {
    window.location = "FoodifyLoginPage.html";
}