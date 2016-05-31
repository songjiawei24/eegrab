/* http */
var http = require("http");
/* fs */
var fs = require('fs');
/* Q */
var Q = require("q");
var parser = require("./parser.js");
module.exports = {
    getHtml: function() {
        var url = "http://www.cic.gc.ca/english/express-entry/past-rounds.asp";
        http.get(url, function(res) {
            var source = "";
            res.on('data', function(data) {
                source += data;
            });
            res.on('end', function() {
                var res = parser.parse(source);
                //console.log(res);
                
                fs.writeFile(__dirname + "/../public/data.json", JSON.stringify(res), function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("New file saved!");
                });
                              
            });
        }).on('error', function() {
            console.log("Error when getting the source");
        });
    }
};