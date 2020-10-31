document.getElementById('submit').addEventListener('click',getinfo)
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
        }))
    }
}