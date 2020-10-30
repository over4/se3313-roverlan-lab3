const express = require('express');
const app = express();
const port =3000;


//read file
var fs=require('fs');
var data=fs.readFileSync('Lab3-timetable-data.json', 'utf8');
//convert file to object in js
var timeTableData=JSON.parse(data);
//setep serving front end code
app.use('/', express.static('static'));
app.get('/',(req,res) =>{
    res.sendFile("./index.html")
});
app.get('/courses/classes',(req,res) =>{
    console.log(`GET request for ${req.url}`);
    res.send(timeTableData);
});
//getting the details of a given part
app.get('/courses/classes/:subject_id', (req,res) =>{
    const id = req.params.subject_id;
    console.log(`GET request for ${req.url}`);
    const subjectCode = timeTableData.filter(s => s.subject === (id)); //search for the term and return an array with each
    if(subjectCode){
        res.send(subjectCode);
    }else{
        res.status(404).send(`Part ${id} was not found`);
    }
})
app.listen(port, () =>{
    console.log(`Listening on port ${port}`);

});