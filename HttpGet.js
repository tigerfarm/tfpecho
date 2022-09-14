var request = require('request');
// var theRequestUrl = 'http://localhost:3000/hello.txt?p1=abc&p2=def';
var theRequestUrl = 'http://localhost:3000/test?To=John&From=Stacy&text=Hello';
// var theRequestUrl = 'http://localhost:3000/get?EventType=onMessageAdded&Attributes=%7B%7D&DateCreated=2021-08-11T17%3A30%3A55.860Z&Index=38&MessageSid=IM9d9dd049fd494746a24945dfbcc1ec5e&AccountSid=ACa---3&Source=SDK&ClientIdentity=dave2&RetryCount=0&Author=dave2&ParticipantSid=MBba977a9efe96481ca01c307812524d7e&Body=hi%20there&ConversationSid=CH6c25138e952448e3b27ef8164097a1c7';
// var theRequestUrl = 'http://localhost:3000/echo.txt?abc=def&f1=d1';
console.log('+ URL request: ' + theRequestUrl);
request({method: "GET", url: theRequestUrl},
        function (error, response, body) {
            console.log(body);
        });

// eof