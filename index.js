// the npm packages
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const querystring = require('querystring');
const app = express();

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN
// var witToken = "EnteryourToken";


// const {Wit, log} = require('node-wit');
// const client = new Wit({
//   accessToken: witToken
// });

let weatherApiKey = process.env.OW_API_KEY;


app.set('port', (process.env.PORT || 4444))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hullo')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge'])
  }

  res.send('No entry')
})

app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      //console.log(webhook_event);
     // console.log(webhook_event.message.nlp.entities);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// function secondEntity(nlp, name){
//   return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
// }

function handleMessage(sender_psid, received_message) {

  let response;
  
  // Check if the message contains text
  if (received_message.text) {

    const greeting = firstEntity(received_message.nlp, 'greetings');
    const stocks_info = firstEntity(received_message.nlp, 'stocks_info');

    const location = firstEntity(received_message.nlp, 'location');
    const weatherCall = firstEntity(received_message.nlp, 'intent');
    const pidgenWeather= firstEntity(received_message.nlp,'pidgen_intent');
    const pidgenGreetings= firstEntity(received_message.nlp,'pidgen_greetings');
    const igboGreetings= firstEntity(received_message.nlp,'igbo_greetings');
    const codeVilleGreet = firstEntity(received_message.nlp,'codeville_greet');
    const selfKnow = firstEntity(received_message.nlp,'selfknow_intent');
    const witThanks = firstEntity(received_message.nlp,'thanks');
    const witBye = firstEntity(received_message.nlp,'bye');



    if (greeting && greeting.confidence > 0.8) {
      response = {
        "text": "Hello Goodday."
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }

    
    else if (stocks_info && stocks_info.confidence > 0.8) {
      // response = {
      //   "text": "Your Stocks are doing fine thanks"
      // }
       // Sends the response message

   
       let ARRIAURL = `https://app.studio.arria.com:443/alite_content_generation_webapp/text/v3g3XPEvkxw;`
       let payloadArria =  {"data":[{"id":"Primary","type":"json","jsonData":{"name":"Mel Gibson","shortname":"Gibson","gender":"male","birthyear":1956,"diedyear":null,"nationality":"American","birthplace":"Peekskill, New York","movies":[{"name":"Lethal Weapon 3","role":"actor","year":1992,"rating":6.7,"award":null,"nominations":[]},{"name":"Get the Gringo","role":"actor","year":2012,"rating":7,"award":null,"nominations":[]},{"name":"War Pigs","role":"actor","year":null,"rating":null,"award":null,"nominations":[]},{"name":"Mad Max Beyond Thunderdome","role":"actor","year":1985,"rating":6.3,"award":null,"nominations":[]},{"name":"We Were Soldiers","role":"actor","year":2002,"rating":7.2,"award":null,"nominations":[]},{"name":"Tequila Sunrise","role":"actor","year":1988,"rating":6,"award":null,"nominations":[]},{"name":"Dragged Across Concrete","role":"actor","year":2018,"rating":8.7,"award":null,"nominations":[]},{"name":"The Road Warrior","role":"actor","year":1981,"rating":7.6,"award":null,"nominations":[]},{"name":"Berserker","role":"director","year":null,"rating":null,"award":null,"nominations":[]},{"name":"Braveheart","role":"actor","year":1995,"rating":8.4,"award":null,"nominations":[]},{"name":"Paparazzi","role":"producer","year":2004,"rating":5.8,"award":null,"nominations":[]},{"name":"Gallipoli","role":"actor","year":1981,"rating":7.5,"award":null,"nominations":[]},{"name":"The Professor and the Madman","role":"actor","year":2019,"rating":null,"award":null,"nominations":[]},{"name":"Lethal Weapon 2","role":"actor","year":1989,"rating":7.2,"award":null,"nominations":[]},{"name":"Attack Force Z","role":"actor","year":1981,"rating":5.6,"award":null,"nominations":[]},{"name":"Conspiracy Theory","role":"actor","year":1997,"rating":6.7,"award":null,"nominations":[]},{"name":"Destroyer","role":"director","year":null,"rating":null,"award":null,"nominations":[]},{"name":"The Man Without a Face","role":"actor","year":1993,"rating":6.7,"award":null,"nominations":[]},{"name":"Summer City","role":"actor","year":1977,"rating":4.5,"award":null,"nominations":[]},{"name":"Mad Max","role":"actor","year":1979,"rating":7,"award":null,"nominations":[]},{"name":"Lethal Weapon","role":"actor","year":1987,"rating":7.6,"award":null,"nominations":[]},{"name":"Pocahontas","role":"actor","year":1995,"rating":6.7,"award":null,"nominations":[]},{"name":"Boss Level","role":"actor","year":2019,"rating":null,"award":null,"nominations":[]},{"name":"What Women Want","role":"actor","year":2000,"rating":6.4,"award":null,"nominations":[]},{"name":"Daddy's Home 2","role":"actor","year":2017,"rating":6,"award":null,"nominations":[]},{"name":"Stonehearst Asylum","role":"producer","year":2014,"rating":6.8,"award":null,"nominations":[]},{"name":"Every Other Weekend","role":"actor","year":null,"rating":null,"award":null,"nominations":[]},{"name":"The Beaver","role":"actor","year":2011,"rating":6.7,"award":null,"nominations":[]},{"name":"Leonard Cohen: I'm Your Man","role":"producer","year":2005,"rating":6.9,"award":null,"nominations":[]},{"name":"Tim","role":"actor","year":1979,"rating":6.5,"award":null,"nominations":[]},{"name":"The River","role":"actor","year":1984,"rating":6.3,"award":null,"nominations":[]},{"name":"Chicken Run","role":"actor","year":2000,"rating":7,"award":null,"nominations":[]},{"name":"Payback","role":"actor","year":1999,"rating":7.1,"award":null,"nominations":[]},{"name":"Hacksaw Ridge","role":"director","year":2016,"rating":8.1,"award":null,"nominations":["Best Director"]},{"name":"Maverick","role":"actor","year":1994,"rating":7,"award":null,"nominations":[]},{"name":"Signs","role":"actor","year":2002,"rating":6.7,"award":null,"nominations":[]},{"name":"The Singing Detective","role":"actor","year":2003,"rating":5.6,"award":null,"nominations":[]},{"name":"Hamlet","role":"actor","year":1990,"rating":6.8,"award":null,"nominations":[]},{"name":"Ransom","role":"actor","year":1996,"rating":6.6,"award":null,"nominations":[]},{"name":"Apocalypto","role":"director","year":2006,"rating":7.8,"award":null,"nominations":[]},{"name":"Lethal Weapon 4","role":"actor","year":1998,"rating":6.6,"award":null,"nominations":[]},{"name":"Blood Father","role":"actor","year":2016,"rating":6.4,"award":null,"nominations":[]},{"name":"The Bounty","role":"actor","year":1984,"rating":7.1,"award":null,"nominations":[]},{"name":"The Million Dollar Hotel","role":"actor","year":2000,"rating":5.9,"award":null,"nominations":[]},{"name":"Forever Young","role":"actor","year":1992,"rating":6.3,"award":null,"nominations":[]},{"name":"Edge of Darkness","role":"actor","year":2010,"rating":6.6,"award":null,"nominations":[]},{"name":"The Passion of the Christ","role":"director","year":2004,"rating":7.2,"award":null,"nominations":[]},{"name":"The Last Trimate","role":"actor","year":2008,"rating":null,"award":null,"nominations":[]},{"name":"Mrs. Soffel","role":"actor","year":1984,"rating":6.3,"award":null,"nominations":[]},{"name":"The Year of Living Dangerously","role":"actor","year":1982,"rating":7.2,"award":null,"nominations":[]},{"name":"Air America","role":"actor","year":1990,"rating":5.7,"award":null,"nominations":[]},{"name":"Bird on a Wire","role":"actor","year":1990,"rating":5.9,"award":null,"nominations":[]},{"name":"The Patriot","role":"actor","year":2000,"rating":7.2,"award":null,"nominations":[]},{"name":"Machete Kills","role":"actor","year":2013,"rating":5.6,"award":null,"nominations":[]},{"name":"The Passion of the Christ: Resurrection","role":"director","year":null,"rating":null,"award":null,"nominations":[]},{"name":"Braveheart","role":"producer","year":1995,"rating":8.4,"award":"Best Picture","nominations":["Best Picture"]},{"name":"Braveheart","role":"director","year":1995,"rating":8.4,"award":"Best Director","nominations":["Best Director"]}]}}],"projectArguments":null,"options":null}
       let payloader = querystring.stringify(payloadArria);
       request({ 
         headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJUMHluQnhQN2RoaEsyN2dKQmJ5T2dUQ0QiLCJpYXQiOjE1NTI1NDgzODYsImV4cCI6MTcxMDIyODM4NiwiaXNzIjoiQUxpdGUiLCJzdWIiOiJCRVlxNzhBQ1lOR18iLCJBTGl0ZS5wZXJtIjpbInByczp4OnYzZzNYUEV2a3h3Il0sIkFMaXRlLnR0IjoidV9hIn0.FCLD4o6AOt5mLtRhUVcerPXlDYdw0njiNXXFTOyPbsSorWCMbg42z9hzY0qCHm9HnV5KgpXL55L8gPYWfw2yRg'
      },
        uri: ARRIAURL,
        body: payloader,
        method: 'POST'
      }
        , function (err, rsp) {
         if (err) {
           response = err;
           console.log('Werror:', err);
         }
         else {
           console.log('body:', rsp);
           let ARRIA = JSON.parse(rsp);
           if (ARRIA.errorType=="null")
           {
             response = {
               "text": `${ARRIA.result}`
             }
           }
 
           else if (weather.cod == 404){
             if(weather.message==="city not found"){
               response = {
                 "text": `This one na city shoo?`
               }
               
             }
             else {
               response = {
                 "text": `Else. Hmmmm. Trying to be smart I See?`
               }
             }
             
           }
         }
 
         // Sends the response message
         callSendAPI(sender_psid, response);
       });

    callSendAPI(sender_psid, response);  
    }

    
    else if (stocks_info &&  location && stocks_info.confidence > 0.8) {
      response = {
        "text": "Your Stocks are doing fine TODAY thanks!!!"
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }

    else if (codeVilleGreet && codeVilleGreet.confidence > 0.8) {
      response = {
        "text": "Why Hello there Children!!!"
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }

    else if (selfKnow && selfKnow.confidence > 0.8) {
      response = {
        "text": "My Name is Mr Harma Tan. Your personal weather forecaster!!!"
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }
    else if (witThanks && witThanks.confidence > 0.8) {
      response = {
        "text": `You're Welcome`
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }
    else if (witBye && witBye.confidence > 0.8) {
      response = {
        "text": `Talk soon!!!`
      }
       // Sends the response message
    callSendAPI(sender_psid, response);  
    }


    else if (weatherCall && location && weatherCall.confidence > 0.8) {

      var weatherCity = location.value;
      console.log("===========================");
      console.log(location);
      console.log("===========================");

      let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApiKey}&units=metric`;

      request(weatherUrl, function (err, rsp) {
        if (err) {
          response = err;
          console.log('Werror:', err);
        }
        else {
          console.log('body:', rsp.body);
          let weather = JSON.parse(rsp.body);
          if (weather.cod == 200)
          {
            response = {
              "text": `The weather in ${weather.name} is ${weather.weather[0].description}. \n The Temperature is ${weather.main.temp} Celsius`
            }
          }

          else if (weather.cod == 404){
            if(weather.message==="city not found"){
              response = {
                "text": `I don't think this is a city`
              }
              
            }
            else {
              response = {
                "text": `Else. Hmmmm. Trying to be smart I See?`
              }
            }
            
          }
          
        }

        // Sends the response message
        callSendAPI(sender_psid, response);
      });





    }

    else if ( pidgenGreetings && pidgenGreetings.confidence > 0.8) {
      
        response = {
          "text": ` My personal person!!!`
        }

        // Sends the response message
        callSendAPI(sender_psid, response);

    }

    else if ( igboGreetings && igboGreetings.confidence > 0.8) {
      
      response = {
        "text": `Nwannem Kedu!`
      }

      // Sends the response message
      callSendAPI(sender_psid, response);

  }

    else if (pidgenWeather && location && pidgenWeather.confidence > 0.8) {

      var weatherCity = location.value;

      let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApiKey}&units=metric`;

      request(weatherUrl, function (err, rsp) {
        if (err) {
          response = err;
          console.log('Werror:', err);
        }
        else {
          console.log('body:', rsp.body);
          let weather = JSON.parse(rsp.body);
          if (weather.cod == 200)
          {
            response = {
              "text": `The weather for ${weather.name} na ${weather.weather[0].description}. \n The Temperature dey ${weather.main.temp} Celsius`
            }
          }

          else if (weather.cod == 404){
            if(weather.message==="city not found"){
              response = {
                "text": `This one na city shoo?`
              }
              
            }
            else {
              response = {
                "text": `Else. Hmmmm. Trying to be smart I See?`
              }
            }
            
          }
        }

        // Sends the response message
        callSendAPI(sender_psid, response);
      });





    }
    else {
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }

      // Sends the response message
      callSendAPI(sender_psid, response);

    }


  }

}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": access },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})
