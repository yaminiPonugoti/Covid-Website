//Database-related Javascript functionality

var applicationID = "aj7gCIM8igszLJNZCv9M6cdDTM72hoNiQ6PM4hJN";
var javascriptKey = "FfINcaGnSpJXpmtGJtiLybn2xj93skaQ4M2Q62z5";
var serverID: "https://parseapi.back4app.com";

function addSurveyEntry(){
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var nImport = Parse.Object.extend("Survey");
	var newImport = new nImport();
	//newImport.set(fieldName, value);
	//newImport.save();
}