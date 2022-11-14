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
        fetch_ip()
            .then(response => response.json())
            .then(data2=>{
                let ipadd = data2["query"];
                let data = {
                    Username: username,
                    Password: password,
                    ip: ipadd
                };
                login(data)
                    .then(response => response.json())
                    .then(data1 => {
                        alert(data1["Error"]);
                        if(data1["Error"] == "Authentication failed") window.location = "FoodifyLoginPage.html";
                        else 
                        {
                            document.cookie = `SID=${data1["Ses_id"]};path=/`;
                            document.cookie = `UID=${data1["Uid"]};path=/`;
                            document.cookie = `NAME=${data1["Name"]};path=/`;
                            window.location = "FoodifyMenu.html";
                        }
                    });
            });
    }
}

const fetch_ip = async () =>
{
    const response = await fetch("http://ip-api.com/json", {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        reffererPolicy: 'no-refferer',
    });

    return response;
}

//starting session script
export const startSessionChecker = (id) =>
{
    return setInterval(cfss, 10000, id);
};

export const killSessionChecker = (id) =>
{
    clearInterval(id);
};

const confirm_session = async (sid, ip) => {
    const response = await fetch(server + "/verify_session", {
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
        body: JSON.stringify({id: sid, ip: ip})
    });

    return response;
};

const cfss = (id) =>
{
    let ip = 0;
    fetch_ip()
        .then(response => response.json())
        .then(data2=>{
            ip = data2["query"];
            confirm_session(id, ip)
                .then(response => response.json())
                .then(data => {
                    //if this is true the session is live
                    //if this is false the session is dead
                    console.log(data["status"]);
            });
        });
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
export function logout() {
    window.location = "FoodifyLoginPage.html";
}

window.onload = () => {
    document.getElementById("validate").addEventListener('click', validate);
    document.getElementById("toRegPage").addEventListener('click', toRegPage);
};
//send ip to backend
