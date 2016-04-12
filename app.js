/* express */
var express = require('express');
var app = express();
/* file sys */
var fs = require('fs');
/* get lastest date from website */
var getData = require("./myModules/getdata.js");
getData.getHtml();

/* load data */
var jsonData = {};
fs.readFile( __dirname + '/public/test.json', function (err, data) {
  if (err) {
    throw err;
  }
  jsonData = JSON.parse(data);
  //console.log(jsonData);
});

/* serve static files */
app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    console.log("get '/'");
    res.send("Hello world");
    
});

app.get('/api/data', function (req, res) {
    console.log("get '/api/data'");
    res.json(jsonData);
    
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});