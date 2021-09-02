# HTTP Web Application to HTTP Echo Request Information

Echo HTTP request data by writing it to a file and optionally sending it as a Conversations message.

Client Application screen print:

<img src="clientapp.jpg" width="400"/>

Sample, use the curl command to make an HTTP request with parameters:
````
curl -X POST https://echo.example.com/Executions \
--data-urlencode "From=+16505551111" \
--data-urlencode "To=+16505552222" \
-u "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_auth_token"
````
The following shows up in the Conversations application, conversation ftpecho.
````
+ Ready
> tfpecho : tfpecho : ------------------------------------------------------
+ POST URL : https://echo.example.com/Executions
--------------
+ Headers : 
++ 0: "host":"echo.example.com"
++ 1: "connection":"close"
++ 2: "authorization":"Basic QUNYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWDp5b3VyX2F1dGhfdG9rZW4="
++ 3: "user-agent":"curl/7.64.1"
++ 4: "accept":"*/*"
++ 5: "content-type":"application/x-www-form-urlencoded"
++ 6: "x-request-id":"e73e58f3-04eb-49e0-b03f-74b79d19bc9c"
++ 7: "x-forwarded-for":"107.22.192.239"
++ 8: "x-forwarded-proto":"https"
++ 9: "x-forwarded-port":"443"
++ 10: "via":"1.1 vegur"
++ 11: "connect-time":"0"
++ 12: "x-request-start":"1630373372709"
++ 13: "total-route-time":"2"
++ 14: "content-length":"37"
--------------
+ POST content raw : 
From=%2B16505551111&To=%2B16505552222
+ POST content name value pairs: 
++ From: +16505551111
++ To: +16505552222
--------------
````

--------------------------------------------------------------------------------
Sample Twilio Conversations HTTP request to my echo server.
````
2021-08-10T18:00:58.254181+00:00 app[web.1]: + POST HTTP headers, count = 16:
2021-08-10T18:00:58.254242+00:00 app[web.1]: ++ 0: "host":"echo.example.com"
2021-08-10T18:00:58.254330+00:00 app[web.1]: ++ 1: "connection":"close"
2021-08-10T18:00:58.254404+00:00 app[web.1]: ++ 2: "content-type":"application/x-www-form-urlencoded; charset=utf-8"
2021-08-10T18:00:58.254461+00:00 app[web.1]: ++ 3: "x-twilio-signature":"hm...w="
2021-08-10T18:00:58.254529+00:00 app[web.1]: ++ 4: "i-twilio-idempotency-token":"2d7c9ee7-f1a3-409f-9283-23f99117dd3b"
2021-08-10T18:00:58.254597+00:00 app[web.1]: ++ 5: "accept":"*/*"
2021-08-10T18:00:58.254655+00:00 app[web.1]: ++ 6: "user-agent":"TwilioProxy/1.1"
2021-08-10T18:00:58.254719+00:00 app[web.1]: ++ 7: "x-request-id":"58de1248-1374-4707-8723-264e14a03104"
2021-08-10T18:00:58.254783+00:00 app[web.1]: ++ 8: "x-forwarded-for":"54.211.77.56"
2021-08-10T18:00:58.254850+00:00 app[web.1]: ++ 9: "x-forwarded-proto":"https"
2021-08-10T18:00:58.254911+00:00 app[web.1]: ++ 10: "x-forwarded-port":"443"
2021-08-10T18:00:58.254977+00:00 app[web.1]: ++ 11: "via":"1.1 vegur"
2021-08-10T18:00:58.255038+00:00 app[web.1]: ++ 12: "connect-time":"1"
2021-08-10T18:00:58.255107+00:00 app[web.1]: ++ 13: "x-request-start":"1628618458249"
2021-08-10T18:00:58.255164+00:00 app[web.1]: ++ 14: "total-route-time":"0"
2021-08-10T18:00:58.255237+00:00 app[web.1]: ++ 15: "content-length":"350"
2021-08-10T18:00:58.255292+00:00 app[web.1]: ---
2021-08-10T18:00:58.256093+00:00 app[web.1]: + theData :EventType=onMessageAdded&Attributes=%7B%7D&DateCreated=2021-08-10T18%3A00%3A58.111Z&Index=35&MessageSid=IM8d613ccb9016450fa29faecfaa7bb6f4&AccountSid=ACa...3&Source=SDK&ClientIdentity=dave&RetryCount=0&Author=dave&ParticipantSid=MBc58b06998c564765bbff41cfd3a03219&Body=two&ConversationSid=CH6c25138e952448e3b27ef8164097a1c7:
2021-08-10T18:00:58.256335+00:00 app[web.1]: + EventType: onMessageAdded
2021-08-10T18:00:58.256493+00:00 app[web.1]: + Attributes: %7B%7D
2021-08-10T18:00:58.256552+00:00 app[web.1]: + DateCreated: 2021-08-10T18%3A00%3A58.111Z
2021-08-10T18:00:58.256769+00:00 app[web.1]: + Index: 35
2021-08-10T18:00:58.256793+00:00 app[web.1]: + MessageSid: IM8d613ccb9016450fa29faecfaa7bb6f4
2021-08-10T18:00:58.256922+00:00 app[web.1]: + AccountSid: ACa...3
2021-08-10T18:00:58.256972+00:00 app[web.1]: + Source: SDK
2021-08-10T18:00:58.257083+00:00 app[web.1]: + ClientIdentity: dave
2021-08-10T18:00:58.300070+00:00 app[web.1]: + RetryCount: 0
2021-08-10T18:00:58.300103+00:00 app[web.1]: + Author: dave
2021-08-10T18:00:58.300172+00:00 app[web.1]: + ParticipantSid: MBc58b06998c564765bbff41cfd3a03219
2021-08-10T18:00:58.300228+00:00 app[web.1]: + Body: two
2021-08-10T18:00:58.300264+00:00 app[web.1]: + ConversationSid: CH6c25138e952448e3b27ef8164097a1c7
````
Sample POST content decoded:
````
+ URL: /app/cgi/echo.php {
"EventType":"onMessageAdded",
"Attributes":"{}",
"DateCreated":"2021-08-10T17:58:19.378Z",
"Index":"33",
"MessageSid":"IMb89c6f96ffa74700a31264f603f4ef34",
"AccountSid":"ACa...3",
"Source":"SDK",
"ClientIdentity":"dave",
"RetryCount":"0",
"Author":"dave",
"ParticipantSid":"MBc58b06998c564765bbff41cfd3a03219",
"Body":"yes",
"ConversationSid":"CH6c25138e952448e3b27ef8164097a1c7"
} 
````

--------------------------------------------------------------------------------
Cheers...
