/* jquery like module, help parsing DOM */
var cheerio = require('cheerio');
var res = []; // js array to return
module.exports = {
    parse: function(source) {
        $ = cheerio.load(source);
            
        $('details').each(function(i, elem){
            var temp = {};// each entry in res
            var dateString = $('h3', this).text();
            var formattedRandD = formatRandD(dateString); // round and date
            temp["round"] = formattedRandD[0];
            temp["date"] = formattedRandD[1];
            
            var formattedNandS = ConstructNandS($('td', this));
            temp["num"] = formattedNandS[0];
            temp["score"] = formattedNandS[1];
            res.push(temp);
        });
        //console.log(res);
        return res.reverse();
    }
}

function formatRandD(str) { // round and date
    var fStr = str.replace(/\s+/g, '').replace('Footnotes','').replace('#','');
    var arr = fStr.split('–');
    return arr;
}
function ConstructNandS(obj) { // number and score
    var arr = [];
    obj.each(function(){
        arr.push(formatNandS($(this).text()));
    });
    return arr;
}
function formatNandS(str){
    return str.replace(/Footnote|points/i, '').replace(/\s+/g, '').replace(/[,\*]/g, '');
}