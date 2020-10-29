const express = require('express');
const app = express();
const port =3000;

//read file
var fs=require('fs');
var data=fs.readFileSync('Lab3-timetable-data.json', 'utf8');
//convert file to object in js
var timetableData=JSON.parse(data);


app.get('/',(req,res) =>{

    res.send("Hello World");

});
app.listen(port, () =>{
    console.log('Listening on port ${port}');

});