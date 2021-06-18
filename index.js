const sql = require('mysql')
var express = require('express')
var cors = require('cors')
const { rows } = require('mssql')
var app = express()
var authmiddleware = require('./middleware/auth.js')
var hash = require('md5')
const md5 = require('md5')
const bcrypt = require('bcrypt')
const saltRound = 10

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const conn = sql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'todo'
})

conn.connect(function(err){
    if(err){
        console.log(err);}
    else {
        console.log("Connected")
    }
})

app.get('/',(req,res)=>{
    res.end(`<html>
    <div>
        <form method="post" action="/todo">
            <input type="text" name="deskripsi">
                <button type="submit">Add</button>
            </input>
        </form>
    </div>
</html>`)
})

app.post('/todo',authmiddleware,(req,res)=>{
    var data = req.body.deskripsi
    var sqlInsert="INSERT INTO tbl_todo_list(deskripsi) VALUES ('"+data+"')"
    conn.query(sqlInsert,data,function(err,data1){
        if(err)throw err
        console.log("DATA HAS INSERT");
    })
    res.end()
})

app.get('/todo',authmiddleware,(req,res)=>{
    conn.query("SELECT * from tbl_todo_list",(err,rows,field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
})

app.delete('/todo/:id',authmiddleware,(req,res)=>{
    conn.query("DELETE from tbl_todo_list WHERE id = '"+req.params.id+"'",(err,rows,field)=>{
        if(!err){
        res.send(rows)
    }
    else
    console.log(err);
    }) 
 
})
//USER
app.post('/user',(req,res,next)=>{
    conn.query('SELECT COUNT(*) as jlh_user FROM user',(err,result)=>{
        var hasil = Object.values(result)
        if(hasil[0].jlh_user > 0){
            authmiddleware(req,res,next)
        }
        else{
            next()
        }
    })
},(req,res)=>{
    var datausername = req.body.username
    var datauserpassword = req.body.password

    //Hash
    datauserpassword = md5(datauserpassword)

    //username unique
    conn.query("SELECT username FROM user WHERE username =?",[datausername],(err,rows,field)=>{
        if(rows.length >1){
            res.send(404)
        }
        else{}
    })
    conn.query("INSERT into user(username,password) VALUES (?,?)",[datausername,datauserpassword],function(err){
        if(err){
            res.send(500)
            return
        }
        
    })
    conn.query("SELECT id_user,username FROM user ORDER BY id_user DESC LIMIT 1",(err,rows,field)=>{
        res.send(rows)
    })
    
})

app.get('/user',authmiddleware,(req,res)=>{
    conn.query("SELECT id_user,username from user",(err,rows,field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
})

app.delete('/user/:id_user',authmiddleware,(req,res,next)=>{
    conn.query('SELECT COUNT(*) as jlh_user FROM user',(err,result)=>{
        var hasil = Object.values(result)
        if(hasil[0].jlh_user <= 1){
            res.send(404)
        }
        else{
            next()
        }
    })
},(req,res)=>{
    conn.query("DELETE from user WHERE id_user = '"+req.params.id_user+"'",(err,rows,field)=>{
        if(!err){
            res.send(rows)
        }
        else
            console.log(err);
    })   
})
var server = app.listen(3000,function(){
    console.log('server is running..');
})


