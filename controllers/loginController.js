const sql = require('mssql');

const sqlConfig = {
    server: 'kindergartenserver.database.windows.net',
    user: 'praise123',
    password: '_4eR^xyoupoL',
    database: 'foodify',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
};

const handleLogin = async (req, res) => {
    try {
        await sql.connect(sqlConfig);
        var result = await sql.query('SELECT * FROM Employee');
        console.log('result');
    } catch (error) {
        throw error;
    }
    res.json(result.recordset);
}

module.exports = {handleLogin};