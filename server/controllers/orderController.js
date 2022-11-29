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
    const order = req.body.OrderIDs;
    console.log(order);
    try {
        await sql.connect(sqlConfig);

        var result = await sql.query(`
        insert into ORDERS
        VALUES (${order[0], order[1]}, )
        `);
    } catch (error) {
        throw error;
    }
    res.send(order);
}

module.exports = {handleGetAllOrders, handleTakeOrder};