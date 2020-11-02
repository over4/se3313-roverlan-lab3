
var globaljson = {  //initialize the object with some default values
    scheduleTitle: "title",
    pairing: [
    ]
};
document.getElementById('submit').addEventListener('click',getinfo)
document.getElementById('AddClass').addEventListener('click',jsonbuilder);
document.getElementById('SubmitSchedule').addEventListener('click',submitSchedule);
document.getElementById('SearchSchedule').addEventListener('click',searchschedule);
document.getElementById('cleardb').addEventListener('click',cleardb);
document.getElementById('clearSingleSchedule').addEventListener('click',clearSingle);
document.getElementById('SearchAllSchedules').addEventListener('click',searchAll);
var globalString = `"{\"scheduleTitle\":\"titleEXAMPLE\",\"pairing\":[{}]}"`; //\"courseCode\":\"AMERICAN\",\"subjectCode\":\"2341A\"
var globalCounter = 0;
var obj;
var flag;

app.use(sanitizer(options));
function getinfo(){
    if(document.getElementById('getcomp').value == "" && document.getElementById('getcourseCode').value == "" && document.getElementById('getsubject').value != ""){ //checking what boxes the user has left blank
        //fetch using just subject
        var subjectString = "/"
        subjectString += document.getElementById("getsubject").value //get the user input
        fetch(subjectString) //fetch the needed data from the backend
        .then(res => res.json()
        .then(data => {
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
            l.removeChild(l.firstChild); //clears the list so new objects can be made for it
            }
            data.forEach(e => {
                const classes = document.createElement('li'); //create a li
                if(e.course_info[0].ssr_component == "LEC"){
                classes.style.color = "#ff0000"; //red text for LEC
                }else if(e.course_info[0].ssr_component == "TUT"){
                    classes.style.color = "#008000"; //green text for tut
                }else if(e.course_info[0].ssr_component == "LAB"){
                    classes.style.color = "#ff00ff"; //pink text for a lab
                }
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`)); //create the text node for the new data
                l.appendChild(classes);
            })
        }))
    }
    else if(document.getElementById('getcomp').value == "" && document.getElementById('getcourseCode').value !== "" && document.getElementById('getsubject').value != ""){ //same idea as above
        //same idea as above
        console.log("in subject and course code");
        var subjectString = "/subject/timetable/";
        subjectString += document.getElementById("getcourseCode").value;
        subjectString += "/" + document.getElementById('getsubject').value;
        console.log(subjectString);
        fetch(subjectString)//same idea as above
        .then(res => res.json()
        .then(data => {
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`));//same idea as above
                l.appendChild(classes);
            })
        }))
    }
    else if(document.getElementById('getcomp').value != "" && document.getElementById('getcourseCode').value != "" && document.getElementById('getsubject').value != ""){//same idea as above
        //fetch using just subject course code and component
        console.log("in subject and course code and comp");
        var subjectString = "/subject/timetable/";
        subjectString += document.getElementById("getcourseCode").value;
        subjectString += "/" + document.getElementById('getsubject').value;
        subjectString += "/" + document.getElementById('getcomp').value;
        fetch(subjectString)//same idea as above
        .then(res => res.json()
        .then(data => {
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.catalog_nbr} ${e.subject} ${e.course_info[0].ssr_component}`)); ////same idea as above
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
        globaljson.pairing.push({"courseCode" :  document.getElementById('addcourseCode').value , "subjectCode" : document.getElementById('addsubject').value}); //push the class into the object
        document.getElementById("labeladdclass").innerText = "added class to schedule";
}
function submitSchedule(){
    //send the json that was created by adding a bunch of pairings
    fetch('/newSchedule/create' , {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(globaljson) //send the built object as a json to the server
    })
    .then(res => {
        if (res.ok){
            console.log(res)
        }else{
            console.log('Error: ', res.status);
        }
    })
    .catch()
    flag = true
    document.getElementById("labeladdclass").innerText = "submitted schedule"; //send a message to the user
    setTimeout(clearmessage , 3000); //erase the message after 3 seconds
}
function clearmessage(){
    document.getElementById("labeladdclass").innerText = "";
}
function searchschedule(){
        var titleString = "/scheduleFinder/";
        titleString += document.getElementById("searchtitle").value;
        fetch(titleString)
        .then(res => res.json()
        .then(data => {
            console.log(data);
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode(`${e.courseCode} ${e.subjectCode}`)); //
                l.appendChild(classes);
            })
        }))
}
function cleardb(){
    fetch("/scheduleDeleteAll/all")
    .then(
        console.log("cleared database of all schedules")
    )
}
function clearSingle(){
    var fetchString = "/scheduleDelete/"
    fetchString += document.getElementById("scheduleTitle").value;
    fetch(fetchString)
    .then(
        console.log("success")
    )
    .catch()
}
function searchAll(){
    fetch("/scheduleSize/size")
    .then(res => res.json()
        .then(data => {
            const l = document.getElementById('classesDisplay');
            while(l.firstChild){
                l.removeChild(l.firstChild);
            }
            data.forEach(e => {
                const classes = document.createElement('li');
                classes.appendChild(document.createTextNode("Title: " + `${e.scheduleTitle}` + " | Number of classes: " + `${e.scheduleSize}`));
                l.appendChild(classes);
            })
        }))

}
    
