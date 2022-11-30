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
            SELECT * FROM ORDERS
        `);
    } catch (error) {
        throw error;
    }
    res.send(JSON.stringify(result.recordsets));
};

const handleTakeOrder = async (req, res) => {
    const cname = req.body.c_name;
    const order = req.body.order;
    const date = Date();
    let orderid;
    try {
        await sql.connect(sqlConfig);

        await sql.query(`
            INSERT INTO ORDERS VALUES(
                '${cname}', '${date}', '${order}'
            )
        `);

        var result = await sql.query(`
                SELECT ORDER_ID FROM ORDERS
                WHERE C_NAME = '${cname}' AND ORDER_DATE = '${date}'
                AND ORDER_DETAILS = '${order}'
        `);

        res.send({response: result.recordsets[0][0]["ORDER_ID"]});
    } catch (error) {
        res.send({response: "error"});
        throw error;
    }
};

module.exports = {handleGetAllOrders, handleTakeOrder};