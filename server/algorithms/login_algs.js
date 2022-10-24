const {createHash} = require('crypto');

const hash_password = (inp) => {
    return createHash('sha256').update(inp).digest('hex');
};

//rules for creating a username: can only contain chars A-Z, a-z, 0-9
//returns error message. If there is no error returns empty string
const processUsr = (usr) =>
{
    if(usr.length > 3 && usr.length < 31)
    {
        let i = 0;
        while(i < usr.length)
        {
            if((usr.charCodeAt(i) < 48 || usr.charCodeAt(i) > 57) && (usr.charCodeAt(i) < 65 || usr.charCodeAt(i) > 90) && (usr.charCodeAt(i) < 97 || usr.charCodeAt(i) > 122))
                return "The username only allows symbols 0-9, A-Z, a-z";
            i++;
        }
        return "";
    }
    else
    {
        if(usr.length < 4) return "Username must be atleast 4 chars";
        return "Username must be less than 31 chars";
    }
}

//rules for username A-Z, a-z, 0-9 only
//mainly to prevent sql injection
const username_filter = (inp) => {
    for(let i = 0; i < inp.length; i++)
    {
        if((inp.charCodeAt(i) < 48 || inp.charCodeAt(i) > 57) && (inp.charCodeAt(i) < 65 || inp.charCodeAt(i) > 90) && (inp.charCodeAt(i) < 97 || inp.charCodeAt(i) > 122))
            return false;
    }
    return true;
};

//generates random ID for employee table. Make sure the
//random id is unique
const id_gen = () => {
    let res = "";
    for(let i = 0; i < 6; i++)
    {
        let rand_range = Math.floor(Math.random() * 3);
        if(rand_range == 0) res += Math.floor(Math.random()*10);
        else if(rand_range == 1) res += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        else res += String.fromCharCode(Math.floor(Math.random() * 26)+97);
    }
    return res;
};

//Stack data structure is used in the processpwd method.
class Stack {
    constructor()
    {
        this.items = [];
    }

    push(item)
    {
        this.items.push(item);
    }

    pop()
    {
        let item = this.items[this.items.length-1];
        if(this.items.length == 0)
            return null;
        this.items.pop()
        return item;
    }

    peek()
    {
        return this.items[this.items.length-1];
    }

    isEmpty()
    {
        return this.items.length == 0;
    }
}

//Ensures newly created password has the following:
// -One symbol
// -One capital
// -One lower case
// -One integer
//Returns an error message. If there is no error returns
//empty string
const processPwd = (pwd) =>
{
    let hasSymbol = false;
    let hasCapital = false;
    let hasLowerCase = false;
    let hasInt = false;
    if(pwd.length < 8) return "The password must be atleast 8 chars";
    if(pwd.length > 64) return "The password must not be longer than 64 chars";
    for(let i = 0; i < pwd.length; i++)
    {
        if(pwd.charCodeAt(i) > 64 && pwd.charCodeAt(i) < 91) hasCapital = true;
        else if(pwd.charCodeAt(i) > 96 && pwd.charCodeAt(i) < 123) hasLowerCase = true;
        else if(pwd.charCodeAt(i) > 47 && pwd.charCodeAt(i) < 58) hasInt = true;
        else hasSymbol = true;
    }
    var error = "The password must include the following: ";
    var errors = new Stack();
    if(!hasCapital) errors.push("one capital");
    if(!hasLowerCase) errors.push("one lower case");
    if(!hasInt) errors.push("one integer");
    if(!hasSymbol) errors.push("one symbol");
    let t = false;
    while(!errors.isEmpty())
    {
        let curError = errors.pop();
        if(!t)
        {
            error += curError;
            t = true;
        }
        else if(errors.isEmpty())
        {
            error += " and " + curError;
        }
        else
        {
            error += ", " + curError;
        }
    }
    if(t) return error;
    return "";
}

module.exports = {hash_password, username_filter, id_gen, processPwd, processUsr};