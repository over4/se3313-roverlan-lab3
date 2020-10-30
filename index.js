const { time } = require('console');
const express = require('express');
const app = express();
const port =3000;
const router = express.Router();


//read file
var fs=require('fs');
var data=fs.readFileSync('Lab3-timetable-data.json', 'utf8');
//convert file to object in js
var timeTableData=JSON.parse(data);
//setep serving front end code
app.use('/', express.static('static'));
//middleware to do logging
app.use((req,res ,next) =>{
    console.log(`${req.method} request for ${req.url}`);
    next(); //go to the next function
});
app.get('/',(req,res) =>{
    res.sendFile("./index.html")
});
router.get('/',(req,res) =>{
    res.send(timeTableData);
});
//getting the details of a given subject
router.get('/:subject_id', (req,res) =>{
    const id = req.params.subject_id;
    const subjectCode = timeTableData.filter(s => s.subject === (id)); //search for the term and return an array with each
    if(subjectCode){
        res.send(subjectCode);
    }else{
        res.status(404).send(`subject ${id} was not found`);
    }
});
//getting the details of a given course id
router.get('/subject/:course_id', (req,res) =>{
    const id = req.params.course_id;
    const courseCode = timeTableData.filter(s => s.catalog_nbr === (id)); //search for the term and return an array with each
    if(courseCode){
        res.send(courseCode);
    }else{
        res.status(404).send(`course code ${id} was not found`);
    }
});
//getting the details for a timetable entry for a given subject code, course code
router.get('/subject/timetable/:course_id/:subject_id/:component_id?', (req,res) =>{
    const courseid = req.params.course_id;
    const subjectid = req.params.subject_id;
    const component_id = req.params.component_id;
    var timetableComp = 1;
    if(!component_id){
    timetableComp = timeTableData.filter((s,x) => { return (s.catalog_nbr === (courseid)) && (s.subject === (subjectid))}); //search for the term and return an array with each
    res.send(timetableComp);
    }
    else if(component_id){
    timetableComp = timeTableData.filter((s,x) => { return (s.catalog_nbr === (courseid)) && (s.subject === (subjectid)) && (s.course_info[0].ssr_component === (component_id))}); //search for the term and return an array with each
    res.send(timetableComp);
    }
    else{
        res.status(404).send(`was not found`);
    }
});
app.use('/courses/classes', router) //install router for courses/classes
app.listen(port, () =>{
    console.log(`Listening on port ${port}`);

});