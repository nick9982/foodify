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

const removeOrder = async (req, res) => {
    let order = req.body.orderid;
    try {
        await sql.connect(sqlConfig);
        await sql.query(`
            DELETE FROM ORDERS
            WHERE ORDER_ID = ${order}
        `);
    } catch (error) {
        throw error;
    }
    res.sendStatus(202);
};

module.exports = {removeOrder};