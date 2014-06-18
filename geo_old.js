var request = require('supertest');
var sys = require('sys');
var APIKey = 'AIzaSyCgvbk-SAc1Ht1bBjY50eoIH7kjezZl_mk';
var googAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var stdin = process.openStdin();
var log = require('custom-logger').config({ level: 0 });
var googleRequest;
var forecastAPIURL = 'https://api.forecast.io/forecast/2ca9f2cb71522c6551cf1d9cc313f543';
var forecastKey = '2ca9f2cb71522c6551cf1d9cc313f543/';
var weather;

googleRequest = request(googAPIURL);
weather = request(forecastAdd);
//Get input from user
stdin.addListener("data", function(d) { 
	var address = d.toString().substring(0, d.length-1);
	var convertedAddress = address.replace(/ /g, '+');
	googAPIURL = googAPIURL + convertedAddress;

	request = request(googAPIURL);


	//Get latitude and longitude from Google
	request.get('/').expect(200, function(err, res){
  	var lat = res.body.results[0].geometry.location.lat;
  	var lng = res.body.results[0].geometry.location.lng;	
  	console.log(lat);
  	console.log(lng);

  	weather.get(lat + "," + lng).expect(200, function(err, res){
  	var getWeather = res.body;
  	console.log(getWeather);
  	
  	})


	});

	//https://api.forecast.io/forecast/2ca9f2cb71522c6551cf1d9cc313f543
});
