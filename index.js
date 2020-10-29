const express = require('express');
const app = express();
const port =3000;


//read file
var fs=require('fs');
var data=fs.readFileSync('Lab3-timetable-data.json', 'utf8');
//convert file to object in js
var timeTableData=JSON.parse(data);


app.get('/courses',(req,res) =>{
    console.log(`GET request for ${req.url}`)
    res.send(timeTableData);

});
app.listen(port, () =>{
    console.log(`Listening on port ${port}`);

});