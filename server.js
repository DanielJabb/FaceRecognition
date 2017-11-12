//Importing relevant libraries (npm)
var express = require('express');
var bodyParser = require('body-parser'); //The bodyParser() module is used for parsing the request body, so you can read post data
var fileUpload = require('express-fileUpload');
var fs = require('fs');
var request = require('request');
var path = require('path');
var server = express();
var najax = require('najax');

server.get("/", function(req, res){
    res.sendFile(__dirname + "/client.html");
})

//Sends input URL to the command prompt
server.use(bodyParser());
server.post('/', function(req, res) {
  //res.sendStatus(200);
  console.log(req.body);

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
  najax(url, {
    headers  : headers,
    type: "POST",
    data: JSON.stringify(payload),
    dataType: "text"}, 
  function(html){ //Gets the JSON info in a single variable 'html'
              fs.appendFile('output.json', JSON.stringify(html, null), function (err) {
                if (err) throw err;
                console.log('The data to append was appended to file!');
            });
});
//Executing readfile() function after 10 seconds so that the contents have been written to the JSON file
setTimeout(function(){
    readfile();
    }, 10000);
setTimeout(function(){
    fs.writeFile('output.JSON', '', function(){console.log('CLEAR')})
    }, 15000);
});

//Read output.JSON file and display contents on console
function readfile(){
  fs.readFile('output.JSON', 'utf8', function(err, contents) {

      //Splitting JSON file containing human analytics by \"
      var info_array = contents.split('\\"');

      //Defining arrays to store race and correlation value
      var race_array = [];
      var value_array = [];

      //Looping through the info_array to find all races
      //Appending race into race_array and correlation value into value_array with matching indices
      for (var j in info_array){
        if (info_array[j] === "asian"){
          race_array.push(info_array[j]);
          value_array.push(info_array[++j]);
          }
        else if (info_array[j] === "hispanic"){
          race_array.push(info_array[j]);
          value_array.push(info_array[++j]);
        }
        else if (info_array[j] === "other"){
          race_array.push(info_array[j]);
          value_array.push(info_array[++j]);
        }
        else if (info_array[j] === "black"){
          race_array.push(info_array[j]);
          value_array.push(info_array[++j]);
        }
        else if (info_array[j] === "white"){
          race_array.push(info_array[j]);
          value_array.push(info_array[++j]);
        }
      }

      //Cleaning correlation values and parsing to convert the string values to floats
      for (var x in value_array){
        value_array[x] = value_array[x].replace(':','');
        value_array[x] = value_array[x].replace(',','');
        value_array[x] = parseFloat(value_array[x]);
      }

      //Initializing variables to find the maximum correlation value and respective index
      var max = 0;
      var max_index;

      //Looping through value_array and finding maximum correction value and matching index for race
      for (var y in value_array){
        if (value_array[y] > max){
          max = value_array[y];
          max_index = y;
        }
      }

      /*
      for (var k in race_array){
        console.log(race_array[k]);
      }
      for (var l in value_array){
        console.log(value_array[l]);
      }
      */

      //Displaying the race with the highest correlation value
      console.log(race_array[max_index] + ": " + max);

  });
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