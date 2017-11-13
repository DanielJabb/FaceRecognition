//Importing relevant libraries (npm)
var express = require('express');
var bodyParser = require('body-parser'); //The bodyParser() module is used for parsing the request body, so you can read post data
var fileUpload = require('express-fileUpload');
var fs = require('fs');
var path = require('path');
var server = express();
var najax = require('najax');

server.get("/", function(req, res){
  res.sendFile(__dirname + "/client.html");
})

server.use(bodyParser());
server.get('/getRaceData', function(req, res) {
    console.log(req.query);

  //Use of KAIROS API to retrieve image information

  //API ID and Key for usage of API
  var headers = {
    "app_id"          : "YOUR_ID",
    "app_key"         : "YOUR_Key"
  };

  //Test image { "image" : "http://dreamicus.com/data/face/face-04.jpg" };

  var url = "http://api.kairos.com/detect";

  // Make request 
  var options = {
      headers  : headers,
      type: "POST",
      data: JSON.stringify(req.query),
      dataType: "text"
    };

 //Retrievs the Kairos JSON info in a single variable 'html'
  najax(url, options, function(response) {
    formatKairosData(response, function(kairosObject) {
      res.send(kairosObject);
    });
  });
});

//Formating returned data from Kairos and parsing through to find relevant information
function formatKairosData(kairosResponse, callback){

      //Parsing through the kairosResponse to access object attributes
      var face = JSON.parse(kairosResponse).images[0].faces[0];

      var raceData = {
        asian: face.attributes.asian,
        white: face.attributes.white,
        hispanic: face.attributes.hispanic,
        black: face.attributes.black,
        other: face.attributes.other
      }

      //Initializing variables to obtain race and correlation level
      var requiredData = {
        race: null,
        max: 0
      };

      for (var race in raceData) {
        if (requiredData.max < raceData[race]) {
          requiredData.race = race;
          requiredData.max = raceData[race];
        }
      }

      callback(requiredData);
 }

//Creating Server
server.listen(3000, function(){
    console.log("Uploaded server listening on port 3000");
})


//The below comments indicate the initial build for uploading a file

/*
//Image importing
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(fileUpload());

//File uploading code to take a local image and send it to a local directory
server.post("/upload", function(req, res){
    if(!req.files){
        res.send("No file uploaded");
    } else{
        var file = req.files.file;
        var extension = path.extname(file.name);
        if(extension !== ".png" && extension !== ".gif" && extension !== ".jpg"){
            res.send("Only images are allowed");
        } else{
            file.mv(__dirname + "/uploads/" + file.name, function(err){
                if(err){
                    res.status(500).send(err);
                } else{
                    res.send("File Uploaded!");
                }
                
            });
        }
    }
});

var dir;

//DISPLAYS FILES FROM DIR IN CONSOLE//
//If argument is missing, use current directory
if (process.argv.length <= 2) {
    dir = __dirname;
}
else {
    dir = process.argv[2];
}

//Logs all files from current directory

fs.readdir(dir, function(err, files) {
   if (err) {
     console.log("Error reading " + dir);
     process.exit(1);
   }
   console.log("Listing files in Directory " + dir);
   files.forEach(function(f) {
      console.log(f);
    });
});

//End of file uploading segment of code
*/