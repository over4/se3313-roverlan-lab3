const { time } = require('console');
const express = require('express');
const sanitizer = require('express-auto-sanitize')
const app = express();
const port =3000;
const router = express.Router();
//database imports
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
//read file
var fs=require('fs');
var data=fs.readFileSync('Lab3-timetable-data.json', 'utf8');
//convert file to object in js
var timeTableData=JSON.parse(data);
//set up express JSON
router.use(express.json());
//setep serving front end code
app.use('/', express.static('static'));
//middleware to do logging
app.use((req,res ,next) =>{
    console.log(`${req.method} request for ${req.url}`);
    next(); //go to the next function
});
const options = {
    query: Boolean,
    body: Boolean,
    cookies: Boolean,
    original: Boolean, // will keep the original version in req.original
    sanitizerFunction: Function // use your personnal sanitizing algorithm
}
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
        res.send(subjectCode); //return the value subjectcode
    }else{
        res.status(404).send(`subject ${id} was not found`);
    }
});
//getting the details of a given course id
router.get('/subject/:course_id', (req,res) =>{
    const id = req.params.course_id;
    const courseCode = timeTableData.filter(s => s.catalog_nbr === (id)); //search for the term and return an array with each
    if(courseCode){
        res.send(courseCode); //return the value of the course code
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
//creating a new schedule
router.put('/newSchedule/create' , (req,res) => {
    db.defaults({ schedule: [] })
    .write()
    const schedule = req.body;
    console.log(req.body);
    if(db.get("schedule").find({scheduleTitle:schedule.scheduleTitle}).value()){ //the return value will be either true or false  if the title exists
        res.send(`schedule title already exists`); //display a message that the title already exists
        return; //exit
    }
    try{ //try writing to the db
    db.get('schedule')
    .push(req.body)
    .write()
    res.send("Successfully wrote to the database");
    console.log("successfully wrote to database");
    }catch(error){ //if there was an error with the db
        console.log("could not write to database");
    }
    
});
//get the llist of subject code, course code pairs for a schedule
router.get('/scheduleFinder/:scheduleID', (req,res) =>{
    const schedule = req.params.scheduleID;
    if(db.get("schedule").find({scheduleTitle:schedule}).value()){
        res.send(db.get("schedule").find({scheduleTitle:schedule}).write().pairing); //return the value of the pairing
    }else{
        res.send("does not exist");
    }
});
router.get('/scheduleDelete/:scheduleID', (req,res) =>{
    const schedule = req.params.scheduleID;
    if(db.get("schedule").find({scheduleTitle:schedule}).value()){
        db.get("schedule").remove({scheduleTitle:schedule}).write();
        res.send("removed from database");
    }else{
        res.send("does not exist");
    }
});
router.get('/scheduleSize/size', (req,res) => {
    var array = [];
    var database = db.get("schedule").write();
    for(i = 0; i< database.length ; i++){
        array.push({scheduleTitle:database[i].scheduleTitle, scheduleSize:database[i].pairing.length})
    }
    res.send(array);
});
router.get('/scheduleDeleteAll/all', (req,res) => {
    db.setState({});
    db.defaults({ schedule: [] });
    res.send("database reset");
});
app.use('/', router) //install router for courses/classes
app.listen(port, () =>{
    console.log(`Listening on port ${port}`);

});