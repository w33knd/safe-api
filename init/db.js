let mysql = require('mysql2');
var variables=require('./globals')

const pool = mysql.createPool({
    host: variables.DB_HOST,
    user: variables.DB_USERNAME,
    database: variables.DB_NAME,
    password: variables.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

// var DatabaseClient = {
//     begin: async function () {
//         // get the client
//         const mysql = require('mysql2/promise');
//         // create the connection
//         const pool = await mysql.createPool({
//             host: 'localhost',
//             user: 'safe-adm',
//             database: 'safe',
//             password: 'safepassword',
//             waitForConnections: true,
//             connectionLimit: 10,
//             queueLimit: 0
//         });
//         // query database
//         // const [rows, fields] = await pool.execute('SELECT 1,2');
//         // console.log(rows); // results contains rows returned by server
//         // console.log(fields);
//         return pool;
//     },
// };
// const connection = mysql.createConnection({
//     host: variables.DB_HOST,
//     user: variables.DB_USERNAME,
//     database: variables.DB_NAME,
//     password: variables.DB_PASSWORD
// });
// connection.end(function(err) {
//     if (err) {
//         return console.log('error:' + err.message);
//     }
//     console.log('Close the database connection.');
// });


module.exports= pool;
  