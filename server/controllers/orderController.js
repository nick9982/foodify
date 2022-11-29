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
let ID = 1;

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
    const order = req.body.orderIDs;
    console.log(order);
    try {
        await sql.connect(sqlConfig);

        // var result = await sql.query(`
        // insert into ORDERS (ORDER_ID, C_NAME, ORDER_DATE, ORDER_DETAILS) 
        // VALUES ('${ID}', 'JOHNNY', '${Date()}', '${order}');
        // `);

        var result = await sql.query(`
        select * from ORDERS;
        `);
    } catch (error) {
        console.log('ERROR ERROR ERROR ERROR ERROR:');
        throw error;
    }
    console.log(result);
    ID = ID + 1;
    res.status(201).send("CREATED");
}

module.exports = {handleGetAllOrders, handleTakeOrder};