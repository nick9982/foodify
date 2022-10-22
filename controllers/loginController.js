const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'kindergartenserver.database.windows.net',
    user: 'praise123',
    password: '_4eR^xyoupoL',
    database: 'foodify'
});

// con.connect( (err) => {
//     if (err) {console.error(err); throw err;}
//     console.log('Connected');
//     var sql_query = "INSERT INTO Employee (EmployeeID, FirstName, LastName, EmployeeType, Username, PW) VALUES ('001', 'John', 'Doe', 'Manager', 'admin', 'admin')";
//     var sql_query2 = "SELECT * FROM Employee";
//     con.query(sql_query2, (err, result, fields) => {
//         if (err) throw err;
//         console.log('result of sql query');
//         console.log(result);
//     });
// });

const handleLogin = (req, res) => {
    con.connect( (err) => {
        if (err) throw err;
        console.log('Connected');
    });
    console.log(req.headers);
    res.json({empty: ''});
}

module.exports = {handleLogin};