const watson = require('watson-developer-cloud');
const weather = require('./weather');
var watsonConversation = watson.conversation({
	username: 'c16e6bfd-1726-4ab7-838f-e6d2a1042239',
	password: 'DueqpQDLOxvy',
	version: 'v1',
	version_date: '2017-05-26'
});

var context_var = {};
var workspace_id = '4a96c520-3c90-4c75-826f-5ad65388d07c';

var conversation = function(text){
	var payload = {
		workspace_id: workspace_id,
		context: {}
	};
	payload.input = { text: text };
	console.log('Payload is ');
	console.log(payload);
	return new Promise(function(resolve, reject){
		watsonConversation.message(payload, function(err, data){
		console.log('Response from conversation service is ');
		console.log(data);
		if ( err ) {
			//return res.status( err.code || 500 ).json( err );
			console.log(err);
		}
		updateMessage(payload, data, function(err, data) {
			//return res.status( 200 ).json( data );
			resolve(data);
		});
		});
	});
}
function updateMessage(input, response, callbackFunc){
	context_var = response.context;
	var city = context_var.city;
	var responseText = response.output.text;
	if(city != null && response.intents[0].intent === 'weather' ){
		weather.getWeather(city).then(function(data) {
			console.log("getWeather is " + data);
			callbackFunc(null, data);
		});  
		return;
	}else{
		return callbackFunc(null, response.output.text[0]);
	}
}
module.exports.conversation = conversation;