// -----------------------------------------------------------------------------
// Conversations Chat web server application
// 
// Easy to use.
// Install modules.
//  $ npm install --save express
//  $ npm install --save express
//  $ npm install --save request
//  $ npm install --save fs
//  $ npm install --save twilio
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
const fs = require("fs");
var theFilename = 'docroot/httpReceive.txt';

const request = require('request');
const url = require("url");
const express = require('express');
var app = express();
app.use(express.json());
//
const client = require('twilio')(process.env.CONVERSATIONS_ACCOUNT_SID, process.env.CONVERSATIONS_ACCOUNT_AUTH_TOKEN);
const conversationSid = process.env.CONVERSATIONS_ECHO_SID;
const participantIdentity = process.env.CONVERSATIONS_ECHO_AUTHOR;

// -----------------------------------------------------------------------------
// When deploying to Heroku, must use the keyword, "PORT".
// This allows Heroku to override the value and use port 80. And when running locally can use other ports.
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------------------
// Send a Conversations chat message that a client can monitor.

function sendChatMessage(theMessage) {
    console.log("++ Create a text message for a Conversation.");
    console.log("+ Conversation SID: " + conversationSid
            + " Participant Identity: " + participantIdentity
            + " messageText: " + theMessage
            );
    client.conversations.conversations(conversationSid)
            .messages
            .create({author: participantIdentity, body: theMessage})
            .then(message => console.log(
                        "+ Created message, SID: " + message.sid
                        ));
}

// -----------------------------------------------------------------------------
// 
function echoHeaders(theHeaders) {
    var theLength = theHeaders.length;
    var headerlist = '';
    for (var i = 0; i < theLength; i++) {
        var theHeaderString = theHeaders[i];
        var aMessage = '';
        // console.log('+ i = ' + i + " " + theHeaderString);
        if (i === 0) {
            aMessage = '++ ' + i + ": " + theHeaderString.substring(1, theHeaderString.length) + '"';
            console.log(aMessage);
        } else if (i === (theLength - 1)) {
            aMessage = '++ ' + i + ": \"" + theHeaderString.substring(0, theHeaderString.length - 1);
            console.log(aMessage);
        } else {
            aMessage = '++ ' + i + ": \"" + theHeaderString + '"';
            console.log(aMessage);
        }
        headerlist = headerlist + aMessage + "\n";
    }
    return(headerlist);
}
// -----------------------------------------------------------------------------
// Echo the POST request.

app.post('*', function (request, res) {
    //
    console.log("------------------");
    var theHeaders = JSON.stringify(request.headers).split('","');
    console.log("+ POST HTTP headers, count = " + theHeaders.length + ":");
    theHeaders = echoHeaders(theHeaders);
    //
    console.log("---");
    let theData = "";
    request.on('data', function (data) {
        // console.log("++ data :"+ data + ":");
        theData += data;
    });
    request.on('end', function () {
        var thePairMessages = '';
        if (theData.indexOf("Content-Disposition: form-data;") > 0) {
            // "content-type":"multipart/form-data; ..."
            // Content-Disposition: form-data; name="From"
            // 
            // +16505551111
            // ----------------------------116322498282777310313542
            console.log("+ theData :" + theData + ":");
            var thePairs = theData.split("Content-Disposition: form-data; name=");
            theLength = thePairs.length;
            for (var i = 1; i < theLength; i++) {
                aPair = thePairs[i];
                es = aPair.indexOf("\"", 1);
                ls = aPair.indexOf("------", 1);
                // console.log('+ i = ' + i + " " + aPair);
                thePairMessage = '++ ' + aPair.substring(1, es) + ': ' + aPair.substring(es + 5, ls - 1);
                console.log(thePairMessage);
                thePairMessages = thePairMessages + thePairMessage + "\n";
            }
        } else {
            // + theData :Identity=davea&Body=Hello%2017&Title=Dave%20here&sound=Moto:
            console.log("+ theData :" + theData + ":");
            var thePairs = theData.split("&");
            theLength = thePairs.length;
            for (var i = 0; i < theLength; i++) {
                aPair = thePairs[i].split("=");
                thePairMessage = '++ ' + aPair[0] + ': ' + decodeURI(aPair[1]);
                console.log(thePairMessage);
                thePairMessages = thePairMessages + thePairMessage + "\n";
            }
        }
        sendChatMessage(
                '------------------------------------------------------\n'
                + '+ URL components : ' + request.method + ' ' + url.parse(request.url).pathname + "\n"
                + '+ Headers : \n' + theHeaders
                + '+ POST content : \n' + thePairMessages
                + '--------------\n'
                );
    });
    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Show POST.');
});

// -----------------------------------------------------------------------------
// Echo the GET request.

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
    var thePairMessages = '';
    var urlComponentMessage = '';
    if (theQueryString === null) {
        urlComponentMessage = '+ URL components : ' + request.method + ' ' + theUrl;
    } else {
        urlComponentMessage = '+ URL components : ' + request.method + ' ' + theUrl + " ? " + theQueryString;
        var thePairs = theQueryString.split("&");
        var theLength = thePairs.length;
        for (var i = 0; i < theLength; i++) {
            aPair = thePairs[i].split("=");
            thePairMessage = '++ ' + aPair[0] + ': ' + decodeURI(aPair[1]);
            console.log(thePairMessage);
            thePairMessages = thePairMessages + thePairMessage + "\n";
        }
    }
    console.log(urlComponentMessage);
    sendChatMessage(
            '------------------------------------------------------\n'
            + '+ URL components : ' + request.method + ' ' + theUrl + "\n"
            + '+ GET content name-value pairs : \n' + thePairMessages
            + '--------------\n'
            );
    if (theUrl !== '/read') {
        fs.writeFile(theFilename, urlComponentMessage, err => {
            if (err) {
                console.error("- Write error: " + err);
            } else {
                console.log("+ Wrote URL components to: " + theFilename);
            }
        });
    }
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    // res.send('+ Show GET.');
    next();
});

// -----------------------------------------------------------------------------
// app.get('/', function (req, res) {
//    res.send('+ Home URI.');
// });
app.get('/hello', function (req, res) {
    res.send('+ hello there.');
});
app.get('/show', function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Show GET.');
});
app.get('/send', function (req, res) {
    var theMessage = "+ From tpfecho.";
    sendChatMessage(theMessage);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Sent message: ' + theMessage);
});

app.get('/read', function (req, res) {
    fs.readFile(theFilename, function (err, data) {
        if (err) {
            console.log("- Error: read file NOT found.");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send('- Error: read file NOT found.');
        } else {
            // console.log(data.toString());
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send('+ File content:\n\r' + data.toString());
        }
    });
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
