// -----------------------------------------------------------------------------
// Conversations Chat web server application
// 
// Easy to use.
// Install modules.
//  $ npm install --save express
//  $ npm install --save request
//  $ npm install --save url
//  $ npm install --save fs
//  
//  "twilio" is only required if sending a Conversations message is implemented.
//  $ npm install --save twilio
//  
// Run the web server. Default port is hardcoded to 8000.
//  $ node websever.js
//  
//  For testing:
//  curl -X POST https://tfpecho.herokuapp.com/Executions \
//  --data-urlencode "From=+16505551111" \
//  --data-urlencode "To=+16505552222" \
//  -u "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_auth_token"
//  
//  curl -X POST http://localhost:3000/abc \
//  --data-urlencode "From=+16505551111" \
//  --data-urlencode "To=+16505552222" \
//  -u "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_auth_token"
//  
//  curl -X GET 'https://tfpecho.herokuapp.com/abc?f1=abc&f2=def'
//  curl -X GET 'http://localhost:3000/abc?f1=abc&f2=def'
//  curl -X GET 'http://localhost:3000/abc'
// 
// curl -X POST http://localhost:3000/callbacks/crm?location=GetCustomersList --data-urlencode "f1=+okay"
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
var sendConversationMessage = "";
const taSid = process.env.CONVERSATIONS_ACCOUNT_SID || "";
const taat = process.env.CONVERSATIONS_ACCOUNT_AUTH_TOKEN || "";
const serviceSid = process.env.CONVERSATIONS_ECHO_SERVICE_SID || "";
const conversationSid = process.env.CONVERSATIONS_ECHO_SID || "";
const participantIdentity = process.env.CONVERSATIONS_ECHO_AUTHOR || "";
var allDefined = true;
if (taSid !== "") {
    console.log("+ taSid: " + taSid);
} else {
    console.log("+ Cannot send conversation messages because CONVERSATIONS_ACCOUNT_SIDX is undefined.");
    allDefined = false;
}
if (taat !== "") {
    console.log("+ taat is defined, not echoed for security reasons.");
} else {
    console.log("+ Cannot send conversation messages because CONVERSATIONS_ECHO_AUTHOR is undefined.");
    allDefined = false;
}
if (serviceSid !== "") {
    console.log("+ serviceSid: " + serviceSid);
} else {
    console.log("+ Cannot send conversation messages because CONVERSATIONS_ECHO_SERVICE_SID is undefined.");
    allDefined = false;
}
if (conversationSid !== "") {
    console.log("+ conversationSid: " + conversationSid);
} else {
    console.log("+ Cannot send conversation messages because CONVERSATIONS_ECHO_SID is undefined.");
    allDefined = false;
}
if (participantIdentity !== "") {
    console.log("+ participantIdentity: " + participantIdentity);
} else {
    console.log("+ Cannot send conversation messages because CONVERSATIONS_ECHO_AUTHOR is undefined.");
    allDefined = false;
}
var clientConversation = "";
if (allDefined) {
    clientConversation = require('twilio')(taSid, taat) || "";
    console.log("++ Ready to send conversation messages.");
}

// -----------------------------------------------------------------------------
// When deploying to Heroku, must use the keyword, "PORT".
// This allows Heroku to override the value and use port 80. And when running locally can use other ports.
const PORT = process.env.PORT || 3000;

var theUrl = '';
var theQueryString = '';

// -----------------------------------------------------------------------------
// Send a Conversations chat message that a clientConversation can monitor.

function echoMessage(theMessage) {
    // Write the echo message to echo file.
    var theSendMessage = '--------------------------------------------------------------------------------------\n' + theMessage;
    fs.writeFile(theFilename, theSendMessage, err => {
        if (err) {
            console.error("- Write error: " + err);
        } else {
            console.log("+ Wrote URL components to: " + theFilename);
        }
    });
    if (!allDefined) {
        // Don't attempt to send a message if the conversation service parameters are not defined.
        return;
    }
    console.log("++ Create a text message for a Conversation.");
    console.log("+ Conversation SID: " + conversationSid
            + " Participant Identity: " + participantIdentity
            + " messageText: " + theSendMessage
            );
    clientConversation.conversations.services(serviceSid).conversations(conversationSid)
            .messages
            .create({author: participantIdentity, body: theMessage})
            .then(message => console.log(
                        "+ Created message, SID: " + message.sid
                        ));
}

// -----------------------------------------------------------------------------
// 
var requestHost = "";

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
        //
        // Set the host variable.
        // ++ 0: "host":"02b26d8de5bd.ngrok.io"
        var hi = theHeaderString.indexOf('host":"');
        if (hi > 0) {
            requestHost = theHeaderString.substring(hi + 'host":"'.length, theHeaderString.length);
        }
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
    // POST without body data: method=POST path="/frontline6?location=GetCustomersList"
    // ++ Header: "content-type":"application/json"
    // ++ Header: "content-length":"803"
    // ???
    request.on('close', function () {
        console.log("++ POST request close.");
        // Processes the same as GET.
        theUrl = url.parse(request.url).pathname;
        theRequest = request.method + ' URL : https://' + requestHost + theUrl;
        theQueryString = url.parse(request.url).query;
        if (theUrl.startsWith("/callbacks/crm") && theQueryString.indexOf("GetCustomersList")>0) {
            // http://localhost:3000/callbacks/crm?location=GetCustomersList
            console.log("++ Frontline customer list request.");
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.send('{"objects": {"customers": [ {"display_name": "John Keats here", "customer_id": "1" } ]}}');
            // + Request processed: POST URL : https://7256-107-210-221-195.ngrok.io/frontline5?location=GetCustomersList
            console.log('----------------------------\n+ Request, Frontline customer list request: ' + theRequest + "?" + theQueryString);
            return;
        }
        res.statusCode = 201;
        res.setHeader('Content-Type', 'text/plain');
        res.send('+ Request processed: ' + theRequest + '\n');
        console.log('----------------------------\n+ Request processed: ' + theRequest + "?" + theQueryString);
    });
    // 
    // POST with body data
    request.on('data', function (data) {
        console.log("++ On data :" + data + ":");
        theData += data;
    });
    let theRequest = "";
    /*
    */
    request.on('end', function () {
        var thePairMessages = '';
        console.log("+ theData :" + theData + ":");
        if (theData.indexOf("Content-Disposition: form-data;") > 0) {
            // "content-type":"multipart/form-data; ..."
            // Content-Disposition: form-data; name="From"
            // 
            // +16505551111
            // ----------------------------116322498282777310313542
            var thePairs = theData.split("Content-Disposition: form-data; name=");
            theLength = thePairs.length;
            for (var i = 1; i < theLength; i++) {
                aPair = thePairs[i];
                es = aPair.indexOf("\"", 1);
                ls = aPair.indexOf("------", 1);
                // console.log('+ i = ' + i + " " + aPair);
                thePairMessage = '   "' + aPair.substring(1, es) + '": "' + aPair.substring(es + 5, ls - 1) + '"';
                console.log(thePairMessage);
                thePairMessages = thePairMessages + thePairMessage + "\n";
            }
        } else {
            // + theData :Identity=davea&Body=Hello%2017&Title=Dave%20here&sound=Moto:
            var thePairs = theData.split("&");
            theLength = thePairs.length;
            for (var i = 0; i < theLength; i++) {
                aPair = thePairs[i].split("=");
                thePairMessage = '   "' + aPair[0] + '": "' + decodeURIComponent(aPair[1] + '"');
                console.log(thePairMessage);
                thePairMessages = thePairMessages + thePairMessage + "\n";
            }
        }
        theRequest = request.method + ' URL : https://' + requestHost + url.parse(request.url).pathname;
        echoMessage(
                // + '+ URL components : ' + request.method + ' ' + theUrl + "\n"
                '+ ' + theRequest + "\n"
                + '--------------\n'
                + '+ Headers : \n' + theHeaders
                + '--------------\n'
                + '+ POST content raw : \n' + theData + '\n'
                + '+ POST content name value pairs: \n' + thePairMessages
                + '--------------\n'
                );
        res.statusCode = 201;
        res.setHeader('Content-Type', 'text/plain');
        res.send('+ Request processed: ' + theRequest + '\n');
        console.log('----------------------------\n+ Request processed: ' + theRequest);
    });
    // Options not used.
    // request.on('finish', () => console.log('finish'))
    // request.on('error', () => console.log('error'))
    // request.on('readable', () => console.log('readable'))

});

// -----------------------------------------------------------------------------
// Echo the GET request.

app.get('*', function (request, res, next) {
    console.log("+ GET request.");
    theUrl = url.parse(request.url).pathname;
    if (theUrl.startsWith("/website") || theUrl === '/read' || theUrl === '/') {
        // Website files are for the browser, no need to echo the request data.
        console.log("> website: " + theUrl);
        next();
        return;
    }
    //
    console.log("------------------");
    // console.log(">" + JSON.stringify(request.headers) + "<");
    var theHeaders = JSON.stringify(request.headers).split('","');
    console.log("+ GET HTTP headers, count = " + theHeaders.length + ":");
    theHeaders = echoHeaders(theHeaders);
    //
    console.log("---");
    theQueryString = url.parse(request.url).query;
    var thePairMessages = '';
    var urlComponentMessage = '';
    if (theQueryString === null) {
        urlComponentMessage = '+ URL components : ' + request.method + ' ' + theUrl;
        theQueryString = "";
    } else {
        urlComponentMessage = '+ URL components : ' + request.method + ' ' + theUrl + " ? " + theQueryString;
        var thePairs = theQueryString.split("&");
        var theLength = thePairs.length;
        for (var i = 0; i < theLength; i++) {
            aPair = thePairs[i].split("=");
            thePairMessage = '++ ' + aPair[0] + ': ' + decodeURIComponent(aPair[1]);
            console.log(thePairMessage);
            thePairMessages = thePairMessages + thePairMessage + "\n";
        }
        theQueryString = "?" + theQueryString;
    }
    console.log(urlComponentMessage);
    echoMessage(
            '+ URL components : ' + request.method + ' ' + theUrl + "\n"
            + '+ Headers : \n' + theHeaders + "\n"
            + '--------------\n'
            + '+ GET URL : https://' + requestHost + theUrl + theQueryString + "\n"
            + '--------------\n'
            + '+ GET content name-value pairs : \n' + thePairMessages
            + '--------------\n'
            );
    console.log('----------------------------\n+ Request processed: GET URL : https://' + requestHost + theUrl);
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    // res.send('+ Show GET.');
    next();
});

// -----------------------------------------------------------------------------
// Process GET requests such as requests from a browser.
// 
app.get('/', function (req, res) {
    // res.send('+ Home URI.');
    res.redirect('/website/index.html');
});
/*  For testing.
 app.get('/hello', function (req, res) {
 res.send('+ hello there.');
 });
 app.get('/show', function (req, res) {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.send('+ Show GET.\n');
 });
 /*  For testing the sending of a conversation message.
 app.get('/send', function (req, res) {
 var theMessage = "+ From tfpecho.";
 echoMessage(theMessage);
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.send('+ Sent message: ' + theMessage);
 });
 */
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
            res.send('+ File content:\n' + data.toString());
        }
    });
});

app.get('*', function (request, res, next) {
    theUrl = url.parse(request.url).pathname;
    if (theUrl.startsWith("/website") || theUrl === '/read' || theUrl === '/') {
        // Website files are for the browser, no need to echo the request data.
        console.log("> website: " + theUrl);
        next();
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('+ Request processed by tfpecho.\n');
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
