const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const watson = require('watson-developer-cloud');
const weather = require('./conversation/weather');
const conversationService = require('./conversation/conversation');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var conversation = watson.conversation({
	username: 'c16e6bfd-1726-4ab7-838f-e6d2a1042239',
	password: 'DueqpQDLOxvy',
	version: 'v1',
	version_date: '2017-05-26'
});

app.get('/', (req, res, next) => {
	res.status(200).send('Hello From HotelName');
});
var context_var = {};

app.post('/conversation', (req, res, next) => {
	console.log('in /conversation endpoint calling the conversation service');
	let text = req.body.text;
	console.log('Request is ');
	console.log(req.body);
	var payload = {
		workspace_id: '7961c162-27a6-4def-9199-ed736379e999',
		context: {}
	};
	payload.input = { text : text };
	if ( req.body ) {
	 	payload.input = { text: text };
		payload.context = context_var;
	}
	// Send the input to the conversation service
	conversation.message( payload, function(err, data) {
		console.log("Data is");
		console.log(data);
		if ( err ) {
			console.log(err);
			return res.status( err.code || 500 ).json( err );
		}	
		updateMessage(payload, data, function(err, data) {
			return res.status( 200 ).json( data );
    });
  });
});

function updateMessage(input, response, callbackFunc) {
  context_var = response.context;
  var city = context_var.city;
  var responseText = response.output.text;
  var curPlace  = context_var.curPlace;
  if (city === undefined) {return callbackFunc(null, responseText)} ;
  if(city != null){
		weather.getWeather(city).then(function(data){
			callbackFunc(null, city+" weather is - "+data);
		});  
	    return;
	}else{
		return callbackFunc(null, response.output.text[0]);
		}
	}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});