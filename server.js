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

server.get("/test", function(req, res) {
  console.log("it worked");
  res.send("test")
})

//Sends input URL to the command prompt
server.use(bodyParser());
server.get('/getRaceData', function(req, res) {
    //res.sendStatus(200);
    console.log(req.query);

  //Use of KAIROS API to upload image information to a JSON file

  //API ID and Key for usage of API
  var headers = {
    "app_id"          : "969bb654",
    "app_key"         : "8fe61971bbb4b59f034db4ddf6528043"
  };

  //Image url to detect
  var payload  = req.body;
  //Test image { "image" : "http://dreamicus.com/data/face/face-04.jpg" };

  var url = "http://api.kairos.com/detect";

  // make request 
  var options = {
      headers  : headers,
      type: "POST",
      data: JSON.stringify(req.query),
      dataType: "text"
    };

  najax(url, options, function(response) { //Gets the JSON info in a single variable 'html'
    formatKairosData(response, function(kairosObject) {
      res.send(kairosObject);
    });
  });
});

//Read output.JSON file and display contents on console
function formatKairosData(kairosResponse, callback){
      //Splitting JSON file containing human analytics by \"
      console.log(JSON.parse(kairosResponse).images[0].faces)

      var face = JSON.parse(kairosResponse).images[0].faces[0];

      //Defining arrays to store race and correlation value
      var raceData = {
        asian: face.attributes.asian,
        white: face.attributes.white,
        hispanic: face.attributes.hispanic,
        black: face.attributes.black,
        other: face.attributes.other
      }

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

      console.log(requiredData);
      callback(requiredData);
 }

/*
TO DO

>Link image upload function and run function, such that the run function takes in the uploaded image 
for use with the API

>Build front end React UI for image uploading

*/

//Create Server
server.listen(3000, function(){
    console.log("Uploaded server listening on port 3000");
})

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