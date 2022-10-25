// this doesnt work
//$(document).ready(function(){
//    $("#div1").fadeIn();
//    $("#div1").animate({down: '50px'});

//});

const server = "http://localhost:8080"
// function validate() {
//     var username=document.getElementById("UN").value;
//     var password=document.getElementById("PW").value;

//     // Connect with backend here to validate user
//     let data = {
//         Username: username,
//         Password: password
//     };
//     const request = new Request(server + "/login", {method: 'POST', body: JSON.stringify(data)});
//     fetch(request)
//         .then((response) => {
//             if(response.status === 200)
//             {
//                 return response.json();
//             }
//         });
// }

function validate()
{
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;
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
        })
    // const response = await fetch(server + "/login", {
    //     method: 'POST',
    //     mode: 'cors',
    //     cache: 'no-cache',
    //     credentials: 'same-origin',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     redirect: 'follow',
    //     reffererPolicy: 'no-refferer',
    //     body: JSON.stringify(data)
    // });

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