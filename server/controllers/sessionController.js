const {session_resetter} = require('./loginController');

const handleSession = async (req, res) => {
    let id = req.body.id;
    let ip = req.body.ip;

    let response = session_resetter(true, id, ip);
    if(response)
        res.send({status: true});
    else
        res.send({status: false});
};

module.exports = {handleSession};