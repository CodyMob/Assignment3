var request = require('supertest');
var sys = require('sys');
var googAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var forecastAPIURL = 'https://api.forecast.io/';
var googleRequest;
var stdin = process.openStdin();



//Get address from user and convert to Google API URL
stdin.addListener("data", function(d) { 
    var address = d.toString().substring(0, d.length-1);
    var convertedAddress = address.replace(/ /g, '+');
    googAPIURL = googAPIURL + convertedAddress;
     
    //Use Google API URL to get lat and long coords
    googleRequest = request(googAPIURL);
    googleRequest.get('/').expect(200, function(err, res){
    var lat = res.body.results[0].geometry.location.lat;
    var lng = res.body.results[0].geometry.location.lng;
        if (err){
          console.log('Error!' + err);
        }
        else{
          //Use lat and long coords to get forecast from forecast API URL
          forecastRequest = request(forecastAPIURL);
          forecastRequest.get('forecast/2ca9f2cb71522c6551cf1d9cc313f543/').expect(200, function(err, res){
          forecastAPIURL = forecastAPIURL + lat + ',' + lng;
            if (err){
              console.log('Error!' + err);
            }
            else{
              console.log('It be working so far');

            }

          });

        }
    });

});