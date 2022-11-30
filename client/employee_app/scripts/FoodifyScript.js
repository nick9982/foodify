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
                    clientType: "employee",
                    ip: ipadd
                };
                login(data)
                    .then(response => response.json())
                    .then(data1 => {
                        if(data1["Error"] == "Authentication failed") window.location = "FoodifyLoginPage.html";
                        else 
                        {
                            /*document.cookie = `SID=${data1["Ses_id"]};SameSite=None;Secure;path=/`;
                            document.cookie = `UID=${data1["Uid"]};SameSite=None;Secure;path=/`;
                            document.cookie = `NAME=${data1["Name"]};SameSite=None;Secure;path=/`;*/
                            const localStorage = window.localStorage;
                            localStorage.setItem("eSID", data1["Ses_id"]);
                            localStorage.setItem("eUID", data1["Uid"]);
                            localStorage.setItem("eNAME", data1["Name"]);
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
    return setInterval(cfss, 10000, id, false);
};

export const killSessionChecker = (id) =>
{
    clearInterval(id);
};

const confirm_session = async (sid, ip, terminate) => {
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
        body: JSON.stringify({id: sid, ip: ip, terminate: terminate, accType: "employee"})
    });

    return response;
};

export const cfss = (id, terminate) =>
{
    let ip = 0;
    fetch_ip()
        .then(response => response.json())
        .then(data2=>{
            ip = data2["query"];
            confirm_session(id, ip, terminate)
                .then(response => response.json())
                .then(data => {
                    //if this is true the session is live
                    //if this is false the session is dead
                    if(data["status"] == 0)
                    {
                        cancel_session();
                        window.location = "FoodifyLoginPage.html";
                    }
                    else if(data["status"] == 1)
                    {
                        cancel_session();
                        window.location = "SessionClosed.html";
                    }
            });
        });
}

const clearCookie = (name, path, domain) =>
{
    if(get_cookie(name))
    {
        document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((domain)?";domain="+domain:"")+
        ";SameSite=None;Secure;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
};

const get_cookie = (name) =>
{
    return document.cookie.split(';').some(c=>{
        return c.trim().startsWith(name+'=');
    });
};

const removePort = (domainhost) =>
{
    let i = 0;
    while(i < domainhost.length)
    {
        if(domainhost.charAt(i) == ":")
        {
            domainhost = domainhost.substring(0, i);
        }
        i++;
    }
    return domainhost;
}

export const cancel_session = () =>
{
    /*let domain = (new URL(window.location.href));
    domain = removePort(domain.host);
    //cancel session on front end
    clearCookie("SID", "/", domain);
    clearCookie("UID", "/", domain);
    clearCookie("NAME", "/", domain);*/
    let sid = window.localStorage.getItem("eSID");
    let uid = window.localStorage.getItem("eUID");
    let name = window.localStorage.getItem("eNAME");
    window.localStorage.removeItem("eSID");
    window.localStorage.removeItem("eUID");
    window.localStorage.removeItem("eNAME");
    window.localStorage.setItem("tmpeSID", sid);
    window.localStorage.setItem("tmpeUID", uid);
    window.localStorage.setItem("tmpeNAME", name);
};

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

window.onload = () => {
    let btntmp;
    if((btntmp = document.getElementById("validate")) != null)
        btntmp.addEventListener('click', validate);
    if((btntmp = document.getElementById("toRegPage")) != null)
        btntmp.addEventListener('click', toRegPage);
    if((btntmp = document.getElementById("register")) != null)
        btntmp.addEventListener('click', register);
};