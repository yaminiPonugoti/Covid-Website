//Database-related Javascript functionality

var applicationID = "aj7gCIM8igszLJNZCv9M6cdDTM72hoNiQ6PM4hJN";
var javascriptKey = "FfINcaGnSpJXpmtGJtiLybn2xj93skaQ4M2Q62z5";
var serverID = "https://parseapi.back4app.com";

function checkValidity(){
	if(!isNaN(document.getElementById("temp"))){
		alert("Invalid temperature value");
		return false;
	}
	return true;
}

function addSurveyEntry(){

	if(!checkValidity()){
		return;
	}
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;
	var bDay = document.getElementById("bDay").value;
	
	localStorage.setItem("fName", fName);
	localStorage.setItem("lName", lName);
	localStorage.setItem("birthdate", bDay);

	//Access elements and place in data structures
	var entry = [
		fName,
		lName,
		bDay,
		
		document.getElementById("fever/chills").checked,
		document.getElementById("cough").checked,
		document.getElementById("breath").checked,
		document.getElementById("fatigue").checked,
		document.getElementById("aches").checked,
		document.getElementById("headache").checked,
		document.getElementById("sense").checked,
		document.getElementById("throat").checked,
		document.getElementById("nose").checked,
		document.getElementById("nausea").checked,
		document.getElementById("diarrhea").checked,
		
		document.getElementById("breathing").checked,
		document.getElementById("chestpain").checked,
		document.getElementById("confusion").checked,
		document.getElementById("insomnia").checked,
		document.getElementById("bluelips").checked,
		
		Number(document.getElementById("temp").value),
		document.getElementById("medicine").value,
		document.getElementById("extradetails").value
	];
	
	var titles = [
		"firstname",
		"lastname",
		"birthdate",
	
		"feverchills",
		"cough",
		"breathingshortness",
		"fatigue",
		"bodyaches",
		"headache",
		"senseloss",
		"sorethroat",
		"congestionrunnynose",
		"nauseavomiting",
		"diarrhea",
		
		"troublebreathing",
		"chestpain",
		"confusion",
		"insomnia",
		"bluelipsface",
		
		"temperature",
		"medicines",
		"othercomments"
	];
	
	//Insert from data structures into database
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var nImport = Parse.Object.extend("Survey");
	var newImport = new nImport();
	for(i=0; i<titles.length; i++){
		newImport.set(titles[i], entry[i]);
		if(i == (titles.length - 1)){
			newImport.save().then(
				(result) => {
					queryDatabase(fName, lName, bDay, "temperature");
					queryDatabase(fName, lName, bDay, "createdAt");
					queryDatabase(fName, lName, bDay, "objectId");
				}
			);
		}
	}
}

function queryDatabase(first, last, birthday, field){
	var resultsArr = [];
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var query = new Parse.Query(Parse.Object.extend("Survey"));
	query.equalTo("firstname", first);
	query.equalTo("lastname", last);
	query.equalTo("birthdate", birthday);
	query.find().then(results => {
		for(i=0; i<results.length; i++){
			if(field == "createdAt"){
				resultsArr[i] = String(results[i].get(field))//.split(" ").slice(1,4).join("-");
			}
			else if(field != "objectId"){
				resultsArr.push(String(results[i].get(field)));
			}
			if(i == results.length - 1){
				localStorage.setItem(field, resultsArr);
				if(field == "objectId"){
					window.open("post-survey.html", "_self");
				}
			}
		}
	});
}