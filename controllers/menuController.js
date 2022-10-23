const sql = require('mssql');

const sqlConfig = {
    server: 'kindergartenserver.database.windows.net',
    user: 'praise123',
    password: '_4eR^xyoupoL',
    database: 'foodify',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 90000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
};

const foodNames = ['Pasta', 'French Fries', 'Ice cream', 'Bread', 'Fried Rice', 'Pancakes', 'Burger', 'Pizza']

const handleMenu = async (req, res) => {
    let totalRows = 0;
    for (let index = 0; index < foodNames.length; index++) {
        let price = Math.floor(Math.random() * 101);
        let uniqueID = Math.floor(Math.random() * 101);
        try {
            await sql.connect(sqlConfig);
            var result = await sql.query(`
            INSERT INTO MenuItems VALUES (${uniqueID}, '${foodNames[index]}', ${price}, 'none', 'none')
            `);
        } catch (error) {
            throw error;
        }
        // Result
        totalRows = parseInt(totalRows) + parseInt(result.rowsAffected);
    }
    res.json({rowsAffected: totalRows});
}

module.exports = {handleMenu};