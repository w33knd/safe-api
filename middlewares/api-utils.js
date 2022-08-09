const res = require('express/lib/response');
const joi = require('joi');
var mysql= require('mysql2');
var globalVariables= require('../init/globals');

const pool = mysql.createPool({
    host: globalVariables.DB_HOST,
    user: globalVariables.DB_USERNAME,
    database: globalVariables.DB_NAME,
    password: globalVariables.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const DEFAULT_OPTIONS={
  isPublic:false
}


function validateRequest(validationSchema){ //check if request content type is json and parameters in correct format using joi
  return (req, res, next) => {
    // if(!req.is('application/json')){
    //   return res.status(415).send("Unsupported content-type");
    // }
    const schema=joi.object(validationSchema);
    const { error } = schema.validate(req.body);
    if (error) {
      // console.log(error);
      return res.json({"success":false,msg:error.details[0].message});
    }
    next();
  }
}

function authenticateRequest(options = DEFAULT_OPTIONS) { 
    return async (req, res, next) => {
        const { authorization: authHeader } = req.headers;
        // console.log(authHeader);
        if (authHeader) {
          var token = authHeader.split(" ");
          var authScheme = token[0].trim();
          var credentials = token[1].trim();
          if(authScheme=="Bearer"){
            pool.execute(`SELECT ID, CASE WHEN Expires = null THEN 1 WHEN Expires > now() THEN 1 ELSE 0 END AS EXPIRYCHECK FROM TOKENS WHERE Bearer = ?;`, [credentials],function(err, rows, fields) {
              if(!err){
                if(rows[0]!==undefined){
									if (rows[0]["EXPIRYCHECK"] == 1) {
										pool.execute(`SELECT USER_ID FROM AUTH WHERE TOKEN_ID = ?;`, [rows[0]["ID"]], function (err, rows) {
											if (!err) {
												res.locals.uid = rows[0]["USER_ID"]; //send uid of user to main controller
												res.locals.bearer = credentials; //send uid of user to main controller
                        next();
											} else {
												return res.status(200).json({"success":false,"msg":"Error Occurred"});
											}
										})
                  } else{
                  return res.status(200).json({"success":false,"msg":"Your Token is Expired"});
                  }
                } else{
                  	return res.status(200).json({"success":false,"msg":"Token does not exist. Login again"});
                }
              } else{
                  return res.status(200).json({"success":false,"msg":"An error occurred"});
              }
            })
            //verify token in database status , revoked or expired
          } else{
            return res.status(401).send("Unknown authentication scheme");      
          }
        } else if (options.isPublic) {
          return next();
        } else {
          return res.send("Unauthorized");
        }
  
        // req.ctx.decodedToken = token;
        // next();
    };
}

module.exports = {validateRequest,authenticateRequest};

