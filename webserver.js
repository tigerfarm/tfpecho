// -----------------------------------------------------------------------------
// Chat web server
// 
// Easy to use.
// Install modules.
//  $ npm install --save express
//  
// Run the web server. Default port is hardcoded to 8000.
//  $ node websever.js
// 
// -----------------------------------------------------------------------------
console.log("+++ HTTP Echo Application web server starting up.");
// -----------------------------------------------------------------------------
var returnMessage = '';
function sayMessage(message) {
    returnMessage = returnMessage + message + "<br>";
    console.log(message);
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Web server interface to call functions.
// -----------------------------------------------------------------------------
// 
// $ npm install express --save
const path = require('path');

// $ npm install --save request
const request = require('request');
// const url = require("url");
//
// When deploying to Heroku, must use the keyword, "PORT".
// This allows Heroku to override the value and use port 80. And when running locally can use other ports.
const PORT = process.env.PORT || 8000;

const express = require('express');
var app = express();
app.use(express.json());

// -----------------------------------------------------------------------------
// 
function echoHeaders(theHeaders) {
    theLength = theHeaders.length;
    for (var i = 0; i < theLength; i++) {
        theHeaderString = theHeaders[i];
        // console.log('+ i = ' + i + " " + theHeaderString);
        if (i === 0) {
            console.log('++ ' + i + ": " + theHeaderString.substring(1, theHeaderString.length) + '"');
        } else if (i === (theLength - 1)) {
            console.log('++ ' + i + ": \"" + theHeaderString.substring(0, theHeaderString.length - 1));
        } else {
            console.log('++ ' + i + ": \"" + theHeaderString + '"');
        }
    }
}
// -----------------------------------------------------------------------------
// Echo the request.

var theUrl = '';
var theQueryString = '';
app.get('*', function (request, res, next) {
    //
    console.log("------------------");
    // console.log(">" + JSON.stringify(request.headers) + "<");
    var theHeaders = JSON.stringify(request.headers).split('","');
    console.log("+ GET HTTP headers, count = " + theHeaders.length + ":");
    echoHeaders(theHeaders);
    //
    console.log("---");
    theUrl = url.parse(request.url).pathname;
    theQueryString = url.parse(request.url).query;
    theQueryStringJson = JSON.stringify(theQueryString);
    if (theQueryStringJson !== null) {
        theQueryString = theQueryStringJson;
    }
    var urlComponentMessage = '+ URL components : ' + request.method + ' ' + theUrl + " ? " + theQueryString;
    console.log(urlComponentMessage);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Show GET.');
    // next();
});

// -----------------------------------------------------------------------------
app.post('*', function (request, res) {
    //
    console.log("------------------");
    var theHeaders = JSON.stringify(request.headers).split('","');
    console.log("+ POST HTTP headers, count = " + theHeaders.length + ":");
    echoHeaders(theHeaders);
    //
    console.log("---");
    let theData = "";
    request.on('data', function (data) {
        theData += data;
    });
    request.on('end', function () {
        // Content-Disposition: form-data; name="From"
        // 
        // +16505551111
        // ----------------------------116322498282777310313542
        // console.log("+ theData :" + theData + ":");
        var thePairs = theData.split("Content-Disposition: form-data; name=");
        // + i = 1 "From"
        // 
        // +16505551111
        // ----------------------------912947162233207412208035
        theLength = thePairs.length;
        for (var i = 1; i < theLength; i++) {
            aPair = thePairs[i];
            es = aPair.indexOf("\"", 1);
            ls = aPair.indexOf("------", 1);
            // console.log('+ i = ' + i + " " + aPair);
            console.log('+ ' + aPair.substring(1, es) + ': ' + aPair.substring(es + 5, ls-1));
        }
    });
    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Show POST.');
});

// -----------------------------------------------------------------------------
app.get('/hello', function (req, res) {
    res.send('+ hello there.');
});
// -----------------------------------------------------------------------------
app.use(express.static('docroot'));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('HTTP Error 500.');
});
app.listen(PORT, function () {
    console.log('+ Listening on port: ' + PORT);
});
