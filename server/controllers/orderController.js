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

const handleGetAllOrders = async (req, res) => {
    try {
        await sql.connect(sqlConfig);
        var result = await sql.query(`
        select * from Orders
        `);
    } catch (error) {
        throw error;
    }
    res.send(JSON.stringify(result.recordsets));
}

const handleTakeOrder = async (req, res) => {
    try {
        await sql.connect(sqlConfig);
        const order = req.body.Order;
        console.log(order);

        var result = await sql.query(`
        select * from Orders
        `);
    } catch (error) {
        throw error;
    }
    res.send(JSON.stringify(order));
}

module.exports = {handleGetAllOrders, handleTakeOrder};