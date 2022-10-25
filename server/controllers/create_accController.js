const sql = require('mssql');
const {hash_password, processUsr, processPwd, id_gen, username_filter} = require('../algorithms/login_algs');

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

const handleCreateAccount = async (req, res) =>
{
    let error = "";
    let user = req.body.Username;
    let pwd = req.body.Password;
    let re_pwd = req.body.Re_enteredPassword; //The password will need to be re-entered
    let type = req.body.Employee_type;
    let name = req.body.Name;
    if(pwd != re_pwd) error += "The passwords do not match\n";
    else
    {
        let pwdErr = processPwd(pwd);
        if(pwdErr.length != 0) error += pwdErr + "\n";
        let usrErr = processUsr(user);
        if(usrErr.length != 0) error += usrErr + "\n";
        if((usrErr.length + pwdErr.length) == 0)
        {
            if(username_filter(name))
            {
                pwd = hash_password(pwd);
                try {
                    await sql.connect(sqlConfig);
                    var result = await sql.query(`
                        SELECT USERNAME FROM EMPLOYEE
                        WHERE USERNAME = '${user}'
                    `);
                    if(result.recordsets[0].length != 0)
                    {
                        error += "The username you have chosen is not available\n"
                    }
                    else
                    {
                        let id_has_gen = false;
                        while(result.recordsets[0].length != 0 || !id_has_gen)
                        {
                            var id = id_gen();
                            result = await sql.query(`
                                SELECT EMPID FROM EMPLOYEE
                                WHERE EMPID = '${id}'
                            `)
                            id_has_gen = true;
                        }
                        await sql.query(`
                            INSERT INTO EMPLOYEE
                            VALUES('${id}', '${user}', '${name}', '${pwd}', '${type}')
                        `);
                    }
                }
                catch(error) {
                    throw error;
                }
            }
            else
            {
                error += "The Name field can only contain chars A-Z, a-z, 0-9\n";
            }
        }
    }
    if(error.length == 0) res.send(JSON.stringify({Error:"Account created successfully"}));
    else
    {
        error = {Error:error};
        res.send(JSON.stringify(error));
    }
}

module.exports = {handleCreateAccount};
