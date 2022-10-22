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

const handleMenu = async (req, res) => {
    try {
        await sql.connect(sqlConfig);
        var result = await sql.query('SELECT * FROM Employee');
    } catch (error) {
        throw error;
    }
    // Result
    res.json(result.recordset);
}

module.exports = {handleMenu};