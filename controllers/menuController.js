const sql = require('mssql');
const sqlConfig = {
    server: 'kindergartenserver.database.windows.net',
    user: 'praise123',
    password: '_4eR^xyoupoL',
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

const handleGetMenu = async (req, res) => {
    for (let index = 0; index < foodNames.length; index++) {
        try {
            await sql.connect(sqlConfig);
            var result = await sql.query(`
            select * from MenuItems
            `);
        } catch (error) {
            throw error;
        }
    }
    res.send(result.recordsets);
}

module.exports = {handleGetMenu};