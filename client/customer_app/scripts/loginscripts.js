function validate()
{
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;

    if(username == '' || password == '') alert('All fields required');
    else
    {
        //fetch ip into login in the backend
        //set cookies upon validation and then set location to the home page
        fetch_ip()
            .then(response => response.json())
            .then(data2=>{
                let ipadd = data2["query"];
                let data = {
                    Username: username,
                    Password: password,
                    clientType: "customer",
                    ip: ipadd
                };
                login(data)
                    .then(response => response.json())
                    .then(data1 => {
                        alert(data1["Error"]);
                        if(data1["Error"] == "Authentication failed") window.location = "login.html";
                        else
                        {
                            document.cookie = `SID=${data1["Ses_id"]};SameSite=None;Secure;path=/`;
                            document.cookie = `UID=${data1["Uid"]};SameSite=None;Secure;path=/`;
                            document.cookie = `NAME=${data1["Name"]};SameSite=None;Secure;path=/`;
                            window.location = "index.html";
                        }
                    });
            })
    }
}


const server = "http://localhost:8080";

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

function backToLogin()
{
    window.location = "login.html";
}

function toRegPage()
{
    window.location = "create_account.html";
}

function register()
{
    var name = document.getElementById("NM").value;
    var username=document.getElementById("UN").value;
    var password=document.getElementById("PW").value;
    var re_enteredPassword = document.getElementById("RPW").value;
    if(name == '' || username == '' || password == '' || re_enteredPassword == '')
    {
        alert('All fields required');
    }
    else
    {   
        let data = {
            Username: username,
            Password: password,
            Re_enteredPassword: re_enteredPassword,
            Name: name
        };
        //backend api call
        create_acc(data)
            .then(response => response.json())
            .then(data => {
                alert(data["Error"]);
                if(data["Error"] == "Account created successfully") window.location = "login.html";
            })
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

const create_acc = async (data) =>
{
    const response = await fetch(server + "/customer_register", {
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

window.onload = () =>
{
    let btntmp;
    if((btntmp = document.getElementById("backtologin")) != null)
        btntmp.addEventListener('click', backToLogin);
    if((btntmp = document.getElementById("register")) != null)
        btntmp.addEventListener('click', register);
    if((btntmp = document.getElementById("login")) != null)
        btntmp.addEventListener('click', validate);
    if((btntmp = document.getElementById("toRegPage")) != null)
        btntmp.addEventListener('click', toRegPage);
};