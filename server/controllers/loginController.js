const sql = require('mssql');
const {hash_password, username_filter, id_gen} = require('../algorithms/login_algs');
var intvals = {};
const sqlConfig = {
    server: 'kindergartenserver.database.windows.net',
    user: 'NicholasMoen',
    password: 'Mo7gajosn8^',
    database: 'foodify',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
};

const handleLoginAttempt = async (req, res) =>
{
    let user = req.body.Username;
    let pass = hash_password(req.body.Password);
    let clientType = req.body.clientType;
    let response;
    if(clientType === "customer")
    {
        if(username_filter(user))
        {
            try
            {
                await sql.connect(sqlConfig);
                var result = await sql.query(`
                    SELECT * FROM CUSTOMER
                    WHERE USERNAME = '${user}'
                    AND PASSWORD = '${pass}'
                `);
                var tempres = result.recordset[0];
            }
            catch(error)
            {
                throw error;
            }
            if(result.recordsets[0].length == 1)
            {
                let id_has_gen  = false;
                while(result.recordsets[0].length != 0 || !id_has_gen)
                {
                    var id = id_gen();
                    var result = await sql.query(`
                        SELECT SES_ID FROM SESSIONS
                        WHERE SES_ID = '${id}'
                    `);
                    id_has_gen = true;
                }
                await sql.query(`
                    INSERT INTO SESSIONS VALUES('${id}', '${tempres["CID"]}', '${req.body.ip}', 0, 'customer');
                `);
                intvals[id] = setInterval(session_resetter, 30000, false, id, req.body.ip);
                response = {Error: "login success", Ses_id: id, Uid: tempres["CID"], Name: tempres["NAME"]};
            }
            else
            {
                response = {Error:"Authentication failed", Ses_id: null, Uid: null, Name: null};
            }
        }
        else
        {
            response = {Error:"Authentication failed", Ses_id: null, Uid: null, Name: null};
        }
    }
    else if(clientType == "employee")
    {
        if(username_filter(user))
        {
            try
            {
                await sql.connect(sqlConfig);
                var result = await sql.query(`
                    SELECT * FROM EMPLOYEE
                    WHERE USERNAME = '${user}'
                    AND PWD = '${pass}'
                `);
                var tempres = result.recordset[0];
            }
            catch(error)
            {
                throw error;
            }
            if(result.recordsets[0].length == 1)
            {
                //start session
                let id_has_gen = false;
                while(result.recordsets[0].length != 0 || !id_has_gen)
                {
                    var id = id_gen();
                    var result = await sql.query(`
                        SELECT SES_ID FROM SESSIONS
                        WHERE SES_ID = '${id}'
                    `);
                    id_has_gen = true;
                }
                await sql.query(`
                    INSERT INTO SESSIONS VALUES('${id}', '${tempres["EMPID"]}', '${req.body.ip}', 0, 'employee')
                `);
                intvals[id] = setInterval(session_resetter, 30000, false, id, req.body.ip);
                response = {Error: "login success", Ses_id: id, Uid: tempres["EMPID"], Name: tempres["NAME"]};
            }
            else
            {
                response = {Error:"Authentication failed", Ses_id: null, Uid: null, Name: null};
            }
        }
        else
        {
            response = {Error:"Authentication failed", Ses_id: null, Uid: null, Name: null};
        }
    }
    res.send(JSON.stringify(response));
}

const session_resetter = async (to_verify, id, ip, accType = "") =>
{
    try
    {
        await sql.connect(sqlConfig);
        var result = await sql.query(`
            SELECT * FROM SESSIONS WHERE SES_ID = '${id}'
        `);
        if(result.recordsets[0].length != 0)
        {
            var AT = result.recordsets[0][0]["CLIENT_TYPE"];
            if(AT != accType && to_verify)
            {
                await sql.query(`
                    DELETE FROM SESSIONS WHERE SES_ID = '${id}'
                `);
                return false;
            }
            if(result.recordsets[0][0]["IP"] != ip)
            {  
                await sql.query(`
                    DELETE FROM SESSIONS WHERE SES_ID = '${id}'
                `);
                clearInterval(intvals[id]);
                delete intvals[id];
                return false;
            }
            else if(intvals[id] == undefined) 
                intvals[id] = setInterval(session_resetter, 30000, false, id, ip);
        }
        else return false;
        if(!to_verify)
        {
            if(result.recordsets[0].length != 0)
            {
                if(result.recordsets[0][0]["CLOCK"] == 4)
                {
                    await sql.query(`
                        DELETE FROM SESSIONS WHERE SES_ID = '${id}'
                    `);
                    console.log("session killed");
                    clearInterval(intvals[id]);
                    delete intvals[id];
                }
                else
                {
                    await sql.query(`
                        UPDATE SESSIONS SET CLOCK = ${result.recordsets[0][0]["CLOCK"]+1} WHERE SES_ID = '${id}'
                    `);
                }
            }
        }
        else
        {
            if(result.recordsets[0].length != 0)
            {
                await sql.query(`
                    UPDATE SESSIONS SET CLOCK = 0 WHERE SES_ID = '${id}'
                `);
            }
            else
            {
                return false;
            }
        }
    }
    catch (error)
    {
        throw error;
    }
    return true;
};

const terminate_session = async (id) =>
{
    try{
        await sql.connect(sqlConfig);
        await sql.query(`
            DELETE FROM SESSIONS WHERE SES_ID = '${id}'
        `);
        clearInterval(intvals[id]);
        delete intvals[id];
        console.log("session killed");
    }
    catch(error)
    {
        throw error;
    }
};

module.exports = {handleLoginAttempt, session_resetter, terminate_session};