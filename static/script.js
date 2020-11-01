var globaljson = {  //initialize the object with some default values
    scheduleTitle: "title",
    pairing: [
    ]
};
document.getElementById('submit').addEventListener('click',getinfo)
document.getElementById('AddClass').addEventListener('click',jsonbuilder);
document.getElementById('SubmitSchedule').addEventListener('click',submitSchedule);
var globalString = `"{\"scheduleTitle\":\"titleEXAMPLE\",\"pairing\":[{}]}"`; //\"courseCode\":\"AMERICAN\",\"subjectCode\":\"2341A\"
var globalCounter = 0;
var obj;
var flag;

function getinfo(){
    if(document.getElementById('getcomp').value == "" && document.getElementById('getcourseCode').value == "" && document.getElementById('getsubject').value != ""){
        //fetch using just subject
        console.log("in subject");
        var subjectString = "/"
        subjectString += document.getElementById("getsubject").value
        fetch(subjectString)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`));
                l.appendChild(classes);
            })
        }))
    }
    else if(document.getElementById('getcomp').value == "" && document.getElementById('getcourseCode').value !== "" && document.getElementById('getsubject').value != ""){
        //fetch using just subject and course code
        //'/subject/timetable/:course_id/:subject_id/:component_id?'
        console.log("in subject and course code");
        var subjectString = "/subject/timetable/";
        subjectString += document.getElementById("getcourseCode").value;
        subjectString += "/" + document.getElementById('getsubject').value;
        console.log(subjectString);
        fetch(subjectString)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`));
                l.appendChild(classes);
            })
        }))
    }
    else if(document.getElementById('getcomp').value != "" && document.getElementById('getcourseCode').value != "" && document.getElementById('getsubject').value != ""){
        //fetch using just subject course code and component
        console.log("in subject and course code and comp");
        var subjectString = "/subject/timetable/";
        subjectString += document.getElementById("getcourseCode").value;
        subjectString += "/" + document.getElementById('getsubject').value;
        subjectString += "/" + document.getElementById('getcomp').value;
        console.log(subjectString);
        fetch(subjectString)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`));
                l.appendChild(classes);
            })
        }))
    }
}
function jsonbuilder(){ // build the schedule json that will later be send
    if(flag == true){ //if a new schedule is made flag is true and means the object needs to be reset
        globaljson = {  //initialize the object with some default values
            scheduleTitle: "title",
            pairing: [
            ]
        };
        flag = false;
    }
        globaljson.scheduleTitle = document.getElementById('addtitle').value;
        globaljson.pairing.push({"courseCode" :  document.getElementById('addcourseCode').value , "subject" : document.getElementById('addsubject').value});
        console.log(globaljson);
}
function submitSchedule(){
    //send the json that was created by adding a bunch of pairings
    fetch('/newSchedule/create' , {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(globaljson)
    })
    .then(res => {
        if (res.ok){
            console.log("success")
        }else{
            console.log('Error: ', res.status);
        }
    })
    .catch()
    flag = true
}