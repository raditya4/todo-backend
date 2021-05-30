const sql = require('mysql')
var express = require('express')
var cors = require('cors')
const { rows } = require('mssql')
var app = express()


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

app.post('/todo',(req,res)=>{
    var data = req.body.deskripsi
    var sqlInsert="INSERT INTO tbl_todo_list(deskripsi) VALUES ('"+data+"')"
    conn.query(sqlInsert,data,function(err,data1){
        if(err)throw err
        console.log("DATA HAS INSERT");
    })
    res.end()
})

app.get('/todo',(req,res)=>{
    conn.query("SELECT * from tbl_todo_list",(err,rows,field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
})

app.delete('/todo/:id',(req,res)=>{
    conn.query("DELETE from tbl_todo_list WHERE id = '"+req.params.id+"'",(err,rows,field)=>{
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


