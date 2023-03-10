const mysql = require('mysql');
const { USER, HOST, CONNECTION_LIMIT, PASSWORD, DATABASE } = require('.');

const db = mysql.createConnection({
    connectionLimit : CONNECTION_LIMIT,
    host : HOST,
    user : USER,
    password : PASSWORD,
    database : DATABASE
})

db.connect(function(error){
    if(error){
        console.log(error);
    }else{
        console.log('connected as ' + db.threadId);
    }
})

module.exports = db;