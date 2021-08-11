var request = require('request');
var basicAuth = "Basic " + Buffer.from("dave" + ":" + "password").toString("base64");

// To echo the form data, the URI needs to have a value such as "/show".

// var theRequestUrl = "http://localhost:3000/2010-04-01/Accounts/123456/Messages." + "json";
var theRequestUrl = 'http://localhost:3000/show';
// var theRequestUrl = 'https://tfpecho.herokuapp.com/show';
var theFormData = {
    From: "+16505551111",
    To: "+16505552222",
    Body: 'Twilio support'
};
console.log('------------------------------------------------');
console.log('+ basicAuth:   ' + basicAuth);
console.log('+ URL request: ' + theRequestUrl);
console.log('+ theFormData: ' + JSON.stringify(theFormData));
console.log('------------------------------------------------');
request({
    method: "POST",
    headers: {
        "Authorization": basicAuth,
        "content-type": "application/x-www-form-urlencoded"
        //, "Chunked": "false"
    },
    url: theRequestUrl,
    formData: theFormData
}, function (error, response, body) {
    console.log(body);
});

// eof