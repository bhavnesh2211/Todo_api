const express = require ( "express" );
const mysql = require ( "mysql" );
const bodyParser = require( "body-parser" );
const app = express();

app.use ( bodyParser.json() );
app.use ( bodyParser.urlencoded({ extended: true }) );

app.use (express.static ( "public" ));

var con = mysql.createConnection ({
    host : "localhost",
    user : "root",
    password : "bhavnesh",
    database : "mydatabse" 
});


con.connect ((err) => {
    if (err) throw err;
    console.log ("Connected!");
});


let createTable = 'create table if not exists todos (id int primary key auto_increment, name varchar (20), descripton varchar(1000))';
con.query (createTable , (err , result) => {
    if (err) throw err;
    console.log ("Table Created!");
});

// get all todos 
app.get ("/getalltodos" , (Request , Response) => {
    con.query ("select * from todos" , (err, result) => {
        if (err) throw err;
        // console.log (json.stringify.result)
        Response.send(JSON.stringify(result))
    });
});

// get todos by id 
app.get ("/gettodosbyid/:id", (Request , Response) => {
    let id = Request.params.id;
    con.query ("select * from todos where id = ?", [id], (err , result) => {
        if (err) throw err;
        Response.send (JSON.stringify(result))
    });
});

// insert new todos
app.post ("/newtodo" , (Request, Response) => {
    let name = Request.body.name;
    let description = Request.body.description;
    con.query ("insert into todos (name , descripton) values (?, ?)", [name , description], (err , result) => {
        if (err) throw err;
        Response.send (JSON.stringify("Your todo is added successfully!"));
        // console.log ("Inserted!");
    });
});

// update todos
app.put ("/updatetodo/:id" , (Request, Response) => {
    let id = Request.params.id;
    let description = Request.body.description;
    let name = Request.body.name;
    con.query ("update todos set name = ? , descripton = ? where id = ?", [name, description, id] , (err, result) => {
        if (err) throw err;
        // console.log (result)
        Response.send (JSON.stringify("Your todo is updated successfully!"));
    });
});

// delete todos
app.delete ("/deletetodo/:eid" , (Request , Response) => {
    let id = Request.params.eid;
    con.query ("delete from todos where id = ?", [id] , (err, result) => {
        if (err) throw err;
        // console.log ("Delete Successfully!");
        var affected = result.affectedRows
        if (affected === 0) {
            Response.send ("Your todo id is wrong !")
        }else {
            Response.send ("Your todo is delete succesfully!")
        }
    });
});

app.listen (5000);
console.log ("Listining");