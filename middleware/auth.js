const { rows } = require("mssql")
const sql = require('mysql')

const conn = sql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'todo'
})

module.exports = function (req,res,next){
    const username = req.headers.username
    const password = req.headers.password

    conn.query("SELECT username FROM user WHERE username=? AND password=?",[username,password],function(err,rows){
        
        if(rows.length > 0){
            next()
        }
        else{
            res.send(401)
        }
    })
}