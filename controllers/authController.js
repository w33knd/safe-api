var globalVariables= require('../init/globals')
var mysql= require('mysql2');
var crypto = require('crypto');
var hat = require('hat');


const pool = mysql.createPool({
    host: globalVariables.DB_HOST,
    user: globalVariables.DB_USERNAME,
    database: globalVariables.DB_NAME,
    password: globalVariables.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// new signup
exports.new_signup= function(req, res) {
    var {CountryCode, Contact, Password, ConfirmPassword, Country} = req.body;
    Contact=CountryCode.trim()+Contact.trim();
    pool.execute('SELECT 1 FROM AUTH WHERE Contact = ?', [Contact],function(err, rows) {
        if(!err){
            if(rows[0]==undefined){
                if(Password==ConfirmPassword){
                    var Passwordhash = crypto.createHmac('sha256',globalVariables.HMAC_SECRET).update(Password).digest('hex');
                    pool.execute("INSERT INTO AUTH (USER_ID, TOKEN_ID, CONTACTS_ID, LOGS_ID, Contact, Password, LoggedIn, JoinDate) values (?,?,?,?,?,?,?,now())",[hat(),hat(),hat(),hat(),Contact,Passwordhash,false],function(err){
                        if(!err){
                            res.status(200).json({"success":true,"msg":"Account created successfully."});
                        } else{
                            SendError(res)
                        }
                    })
                } else{
                    SendError(res,"Passwords does not match.");
                }
            } else{
                SendError(res,"User already registered, Try logging in.");
            }    
        } else{
            SendError(res)
        }
    })
};

//new login
exports.new_login = function(req, res) {
    var {CountryCode, Contact, Password, Platform} = req.body;
    Contact = CountryCode.trim() + Contact.trim();
    
    pool.execute('SELECT TOKEN_ID, USER_ID, Contact, Password FROM AUTH WHERE Contact = ?', [Contact],function(err, rows, fields) {
        if(!err){
            if(rows[0]==undefined){
                SendError(res,"Contact or Password is incorrect.");
            } else{
                if(rows[0]['Password']==crypto.createHmac('sha256',globalVariables.HMAC_SECRET).update(Password).digest('hex')){
                    const bearer = hat(bits = 256);
                    pool.execute("UPDATE AUTH SET LoggedIn= true WHERE USER_ID=?", [rows[0]["USER_ID"]], function (err) { if (err) { SendError(res); } })
                    if(Platform.trim()=="mobile"){
                        pool.execute("INSERT INTO TOKENS (ID, Bearer, Expires, UserAgent, IPaddr) values (?,?,(SELECT DATE_ADD(NOW(),INTERVAL 1 YEAR) AS DATEADD FROM AUTH),?,?);",[rows[0]['TOKEN_ID'],bearer,req.headers['user-agent'],req.connection.remoteAddress],function(err){
                            if(!err){
                                res.status(200).json({"success":true,"BearerToken":bearer,"uid":rows[0]["USER_ID"]});
                            } else{
                                SendError(res);
                            }
                        });    
                    } else{
                        pool.execute("INSERT INTO TOKENS (ID, Bearer, Expires, UserAgent, IPaddr) values (?,?,(SELECT DATE_ADD(NOW(),INTERVAL 2 DAY) AS DATEADD FROM AUTH),?,?);",[rows[0]['TOKEN_ID'],bearer,req.headers['user-agent'],req.connection.remoteAddress],function(err){
                            if(!err){
                                res.status(200).json({"success":true,"BearerToken":bearer,"uid":rows[0]["USER_ID"]});
                            } else{
                                SendError(res);
                            }
                        });    
                    }
                } else{
                    SendError(res,"Contact or Password is incorrect.");
                }
            }    
        }
    })
};

exports.logout = function (req, res) {
    pool.execute('DELETE FROM TOKENS WHERE Bearer = ?', [res.locals.bearer], function (err, rows, fields) {
        if (!err) {
            return res.status(200).json({"success": true});
        } else {
            SendError(res);
        }
    })
};

function SendError(res,msg="Error Occurred"){
    return res.status(200).json({
        "success":false,
        "msg":msg
    })
}