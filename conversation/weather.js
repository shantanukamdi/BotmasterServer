const request = require('request');
const API_KEY = '285b1d22ced8d5867bcf0ae45e6f037c';
const getWeather = function(city){
	console.log('City in getWeather function is');
	console.log(city);
	const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
	return new Promise(function(resolve, reject){
		request({
			url: API_URL,
			qs: {
				q: city,
				appId: API_KEY
			},
			method: 'GET'
		}, function(error, response, body){
			let b = JSON.parse(response.body);
			if(error){
				reject(error);
			}
			console.log('Weather in city'+city+' is ');
			console.log(b.weather[0].description);
			resolve(b.weather[0].description);
		});
	});
}
module.exports.getWeather = getWeather;