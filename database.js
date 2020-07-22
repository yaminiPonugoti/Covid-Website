//Database-related Javascript functionality

var applicationID = "aj7gCIM8igszLJNZCv9M6cdDTM72hoNiQ6PM4hJN";
var javascriptKey = "FfINcaGnSpJXpmtGJtiLybn2xj93skaQ4M2Q62z5";
var serverID = "https://parseapi.back4app.com";

var latlon = {};

function setStatesRef(){
	var value;
	for(p=0; p<stateData.length; p++){
		value = stateData[p].split(",");
		latlon[value[0]] = [value[1], value[2]];
	}
}


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
		document.getElementById("extradetails").value,
		
		0,
		"",
		Number(latlon[document.getElementById("location").value][0]),
		Number(latlon[document.getElementById("location").value][1])
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
		"othercomments",
		
		"symptomcount",
		"symptomslist",
		"latitude",
		"longitude"
	];
	
	for(c=3; c<entry.length-7; c++){
		if(entry[c]){
			entry[entry.length-4] += 1;
			entry[entry.length-3] += titles[c] + "/"
		}
	}
	entry[entry.length-3] = entry[entry.length-3].substring(0,entry[entry.length-3].length-1);
	
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
					queryDatabase(fName, lName, bDay, "symptomcount");
					queryDatabase(fName, lName, bDay, "symptomslist", true);
				}
			);
		}
	}
}

function queryDatabase(first, last, birthday, field, extras = false){
	var severe = false;
	var resultsArr = [];
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var query = new Parse.Query(Parse.Object.extend("Survey"));
	query.equalTo("firstname", first);
	query.equalTo("lastname", last);
	query.equalTo("birthdate", birthday);
	query.find().then(results => {
		for(i=0; i<results.length; i++){
		
			//check for severe symtpoms
			if(results[i].get("troublebreathing") || results[i].get("chestpain") || results[i].get("confusion") || results[i].get("insomnia") || results[i].get("troublebreathing") || results[i].get("bluelips") || results[i].get("temperature") > 102){
				severe = true;
			}
		
			if(field == "createdAt"){
				resultsArr[i] = String(results[i].get(field)).split(" ").slice(1,3).join("-") + " " + String(results[i].get(field)).split(" ").slice(4,5);
			}
			else if(field != "objectId"){
				resultsArr.push(results[i].get(field));
			}
			if(i == results.length - 1){
				localStorage.setItem("severe", severe);
				localStorage.setItem(field, resultsArr);
				if(extras){
					var query2 = new Parse.Query(Parse.Object.extend("Survey"));
					query2.equalTo("firstname", first);
					query2.equalTo("lastname", last);
					query2.equalTo("birthdate", birthday);
					query2.find().then(results => {
						window.open("post-survey.html", "_self");
					});
				}
			}
		}
	});
}

function adminLogin(name, password){
	var locations = [];
	var allSymptoms = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var allSymptomNames = [
		"fever/chills",
		"cough",
		"breathing shortness",
		"fatigue",
		"body aches",
		"headache",
		"sense loss",
		"sore throat",
		"congestion/runny nose",
		"nausea/vomiting",
		"diarrhea",
		
		"trouble breathing",
		"chest pain",
		"confusion",
		"insomnia",
		"blue lips/face"
	];
	var needToAddLocation;
	var incrementIndex = 0;
	Parse.initialize(applicationID, javascriptKey);
	Parse.serverURL = serverID;
	var query = new Parse.Query(Parse.Object.extend("admin"));
	query.equalTo("name", name);
	query.find().then(results => {
		if(results.length > 0){
			var query2 = new Parse.Query(Parse.Object.extend("Survey"));
			query2.find().then(results2 => {
				for(i=0; i<results2.length; i++){
				
					if(results2[i].get("feverchills")){allSymptoms[0] += 1;}
					if(results2[i].get("cough")){allSymptoms[1] += 1;}
					if(results2[i].get("breathingshortness")){allSymptoms[2] += 1;}
					if(results2[i].get("fatigue")){allSymptoms[3] += 1;}
					if(results2[i].get("bodyaches")){allSymptoms[4] += 1;}
					if(results2[i].get("headache")){allSymptoms[5] += 1;}
					if(results2[i].get("senseloss")){allSymptoms[6] += 1;}
					if(results2[i].get("sorethroat")){allSymptoms[7] += 1;}
					if(results2[i].get("congestionrunnynose")){allSymptoms[8] += 1;}
					if(results2[i].get("nauseavomiting")){allSymptoms[9] += 1;}
					if(results2[i].get("diarrhea")){allSymptoms[10] += 1;}
					if(results2[i].get("troublebreathing")){allSymptoms[11] += 1;}
					if(results2[i].get("chestpain")){allSymptoms[12] += 1;}
					if(results2[i].get("confusion")){allSymptoms[13] += 1;}
					if(results2[i].get("insomnia")){allSymptoms[14] += 1;}
					if(results2[i].get("bluelipsface")){allSymptoms[15] += 1;}
				
					needToAddLocation = true;
					for(j=0; j<locations.length; j++){
						if(locations[j][1] == results2[i].get("latitude")){
							needToAddLocation = false;
							incrementIndex = j;
							break;
						}
					}
					if(needToAddLocation){
						locations.push([1, results2[i].get("latitude"), results2[i].get("longitude")]);
					}
					else{
						locations[incrementIndex][0] += 1;
					}
				}
				localStorage.setItem("symptomNames", allSymptomNames);
				localStorage.setItem("allSymptoms", allSymptoms);
				localStorage.setItem("locations", locations);
				window.open("adminDataViz.html", "_self");
			});
		}
	});
}