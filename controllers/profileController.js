var globalVariables = require('../init/globals');
var hat = require('hat');
var mysql= require('mysql2');

const pool = mysql.createPool({
    host: globalVariables.DB_HOST,
    user: globalVariables.DB_USERNAME,
    database: globalVariables.DB_NAME,
    password: globalVariables.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

exports.complete_profile = function(req, res) {
    // { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 }
    var {uid} = req.params;
    if(uid.trim().match(/[0-9a-f]{32}/)==null){
        return SendError(res,"UID is not in correct format.");
    } else{
        var {FirstName,LastName,Gender,BirthDate,Aadhar,HomeAddress} = req.body;
        const USER_ID = res.locals.uid;
        if (uid == USER_ID) {
            pool.execute("SELECT Profile_Complete FROM AUTH WHERE USER_ID=?", [USER_ID], function (err, rows) {
                if (err) { SendError(res); }
                else {
                    if (rows[0]["Profile_Complete"] == false) {
                        pool.execute("UPDATE AUTH SET Profile_Complete= true WHERE USER_ID=?", [USER_ID], function (err) { if (err) { SendError(res); } })
                        var b = BirthDate.split("/");
                        pool.execute("INSERT INTO USER_INFO (UID, FirstName, LastName, BirthDate, Aadhar, Gender, HomeAddress, USER_TYPE_ID) values (?,?,?,?,?,?,?)", [USER_ID, FirstName, LastName, b[2] +"-" +b[0] +"-"+ b[1], Aadhar, Gender, HomeAddress, hat()], function (err,rows) {
                            if (!err) {
                                res.status(200).json({"success":true,"msg":"Updated"});
                            } else {
                                return SendError(res);
                            }
                        })      
                    } else { SendError(res,"Profile is Complete, Try Updating."); }
                }
            })
        } else {
            return SendError(res,"Cant Update another person profile")
        }
    }
};

exports.update_profile = function(req, res) {
    // { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 }
    var {uid} = req.params;
    if(uid.trim().match(/[0-9a-f]{32}/)==null){
        return SendError(res,"UID is not in correct format.");
    } else{
        const USER_ID = res.locals.uid;
        if (uid == USER_ID) {
            pool.execute("SELECT Profile_Complete FROM AUTH WHERE USER_ID=?", [USER_ID], function (err, rows) {
                if (err) { SendError(res); }
                else {
                    if (rows[0]["Profile_Complete"] == true) {
                        var b = BirthDate.split("/"); // format date in mysql formats
                        // console.log(b[2] +"-" +b[0] +"-"+ b[1]);
                        pool.execute("UPDATE USER_INFO SET FirstName=?, LastName=?, BirthDate=?, Aadhar=?, Gender=?, HomeAddress=? WHERE UID=?", [FirstName, LastName, b[2] +"-" +b[0] +"-"+ b[1] , Aadhar, Gender, HomeAddress, USER_ID], function (err) {
                            if (!err) {
                                res.status(200).json({"success":true,"msg":"Updated"});
                            } else {
                                return SendError(res);
                            }
                        })      
                    } else { SendError(res,"Profile is not available."); }
                }
            })
        } else {
            return SendError(res,"Cant Update another person profile")
        }
    }
};

exports.get_profile = function(req, res) {
    // var name = req.params.name;
    var {uid} = req.params;
    if(uid.trim().match(/[0-9a-f]{32}/)==null){
        return SendError(res,"UID is not in correct format.");
    } else{
        const USER_ID = res.locals.uid;
        if (uid == USER_ID) {
            pool.execute("SELECT Profile_Complete FROM AUTH WHERE USER_ID=?", [USER_ID], function (err, rows) {
                if (err) { SendError(res); }
                else {
                    if (rows[0]["Profile_Complete"] == true) {
                        pool.execute("SELECT FirstName, LastName, Aadhar, Gender, HomeAddress FROM USER_INFO WHERE UID=?", [USER_ID], function (err,rows) {
                            if (!err) {
                                res.status(200).json({
                                    "success": true, "data": {
                                    FirstName: rows[0]["FirstName"],
                                    LastName: rows[0]["LastName"],
                                    Aadhar: rows[0]["Aadhar"],
                                    Gender: rows[0]["Gender"],
                                    HomeAddress: rows[0]["HomeAddress"],
                                }});
                            } else {
                                return SendError(res);
                            }
                        })      
                    } else { SendError(res,"Profile is Complete, Try Updating."); }
                }
            })
        } else {
            return SendError(res,"Can't Get another person profile")
        }
    }
};

exports.add_contact = function(req, res) {
    // var name = req.params.name;
    var {uid} = req.params;
    if(uid.trim().match(/[0-9a-f]{32}/)==null){
        return SendError(res,"UID is not in correct format.");
    } else {
        var {Name,Email,Contact,Relation,Age} = req.body;
        const USER_ID = res.locals.uid;
        if (uid == USER_ID) {
            pool.execute("INSERT INTO EMERGENCY_CONTACTS (ID, Name, Email, Contact, Relation, Age) values ((SELECT CONTACTS_ID FROM AUTH WHERE USER_ID=?),?,?,?,?,?)", [USER_ID,Name,Email,Contact,Relation,Age], function (err) {
                if (err) { SendError(res); }
                else {
                    res.status(200).json({ "success": true, "msg": "Contact Added" });
                }
            })
        } else {
            return SendError(res,"Can't Get another person profile")
        }
    }
};


function SendError(res, msg="Error Occurred"){
    return res.status(200).json({
        "success":false,
        "msg":msg
    })
}