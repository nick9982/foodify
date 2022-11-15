const {session_resetter, terminate_session} = require('./loginController');
const sql = require('mssql');

const handleSession = async (req, res) => {
    let id = req.body.id;
    let ip = req.body.ip;
    let terminate = req.body.terminate;
    if(id == undefined)
    {
        res.send({status: 0});
        return;
    }
    if(!terminate)
    {
        let response = session_resetter(true, id, ip);
        if(response)
            res.send({status: 2});
        else
            res.send({status: 1});
        return;
    }

    terminate_session(id);
    res.send({status: 0});

};
module.exports = {handleSession};