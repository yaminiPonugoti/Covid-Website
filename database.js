//Database-related Javascript functionality

var applicationID = "aj7gCIM8igszLJNZCv9M6cdDTM72hoNiQ6PM4hJN";
var javascriptKey = "FfINcaGnSpJXpmtGJtiLybn2xj93skaQ4M2Q62z5";
var serverID: "https://parseapi.back4app.com";

function addSurveyEntry(){
	//Access elements and place in data structure
	var entry = new Map();
	entry.set("fever/chills", document.getElementById("symptomForm").elements.namedItem("fever/chills").value);
	console.log(entry.get("fever/chills"));
	
	//Insert from data structure into database
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var nImport = Parse.Object.extend("Survey");
	var newImport = new nImport();
	//newImport.set(fieldName, value);
	//newImport.save();
}