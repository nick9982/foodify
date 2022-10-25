const sql = require('mssql');
const {hash_password, username_filter} = require('../algorithms/login_algs');

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
    let response;
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
        }
        catch(error)
        {
            throw error;
        }
        if(result.recordsets[0].length == 1)
        {
            response = {Error: "login success"};
        }
        else
        {
            response = {Error:"Authentication failed"};
        }
    }
    else
    {
        response = {Error:"Authentication failed"};
    }
    console.log(JSON.stringify(response));
    res.send(JSON.stringify(response));
}

module.exports = {handleLoginAttempt};