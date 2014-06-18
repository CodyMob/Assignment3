var newRequest = require('supertest');
var sys = require('sys');
var fs = require('fs');
var logFile = 'forecastLog.log';
var googAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var forecastAPIURL = 'https://api.forecast.io/forecast/2ca9f2cb71522c6551cf1d9cc313f543/';
var googleRequest;
var forecastRequest;
var stdin = process.openStdin();



//Get address from user and convert to Google API URL
stdin.addListener("data", function(d) { 
  var address = d.toString().substring(0, d.length-1);
  var convertedAddress = address.replace(/ /g, '+');
  googAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + convertedAddress;

  MakeGoogleRequest(googAPIURL, function (err, lat, lng){
    if(err){
      console.log('Error with thing thing' + err);
    }
    else{
      MakeForecastRequest(lat, lng, function(err, forecastSummary){
          if(err){
            console.log('Error with thing!');
          }
          else{
            WriteToFile(forecastSummary);
          }

      });
    }
  });
});

function MakeGoogleRequest(addressForGoogle, functionForWhenTheGoogleRequestIsComplete){
  googleRequest = newRequest(googAPIURL);
  googleRequest
    .get(addressForGoogle)
    .send()
    .expect(200)
    .end(function(err, res){
    if (err){
       console.log('Error!' + err);
       functionForWhenTheGoogleRequestIsComplete(err)
    }
    else{
      //Google request was successful
      var lat = res.body.results[0].geometry.location.lat;
      var lng = res.body.results[0].geometry.location.lng;
      functionForWhenTheGoogleRequestIsComplete(null, lat, lng);
    }
  });
}
  //Use Google API URL to get lat and long coords
  

function MakeForecastRequest(lat, lng, done){
  var path = 'forecast/2ca9f2cb71522c6551cf1d9cc313f543/' + lat + ',' + lng;
  newRequest('https://api.forecast.io/')
    .get(path)
    .send()
    .expect(200)
    .end(function(err, forecastIOResponse){
      if(err){
        console.log('Error, unable to make forecast request!' + err);
        done(err);
      }
        else{
          var forecast = forecastIOResponse.body.currently.summary;
          done(null, forecast);
        }

    })
}

function WriteToFile(textToWrite){
    fs.appendFile(logFile, textToWrite += '\n', function (err){
      if(err){
        console.log('Error writing test to file!' + err);
      }
      else{
        console.log('Text written to file!');
      } 
  }); 
}