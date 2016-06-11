var express = require('express');
var app = express();
var apiRequest = require('sync-request');
var Cache = require( 'tiny-cache' );
var localStorage = require('localStorage');
var localCache = new Cache();
//localStorage.clear();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get( /\/api.*/, function(request, originalRes ) {

	var apiUrl = 'https://api.mapbox.com' + request.originalUrl.replace( "/api" , "" )
	//console.log( apiUrl  )

	/*// CACHE WARMUP START

	res = apiRequest('GET', apiUrl , {
	  'timeout': 10000
	});

	if ( res.statusCode = 200 ) {
		console.log( "Store to cache" )
		response = res.getBody();
		localCache.setItem( apiUrl , response );
		originalRes.send( response );
	}

	else {
		console.log( "API request failed!")
		originalRes.send( '{error}')
	}

	// CACHE WARMUP END
	*/
	var response = localCache.getItem( apiUrl );

	if ( response ) {
		console.log( "From cache" )
		originalRes.send( response )
	}

	else {
		res = apiRequest('GET', apiUrl , {
		  'timeout': 10000
		});

		if ( res.statusCode = 200 ) {
			console.log( "Store to cache" )
			response = res.getBody();
			localCache.setItem( apiUrl , response );
			originalRes.send( response );
		}

		else {
			console.log( "API request failed!")
			originalRes.send( '{error}')
		}
	}

	originalRes.end();

	/*
	var request = require('request');
	request('https://api.mapbox.com' + request.originalUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    originalRes.send( body ); // Show the HTML for the Google homepage.
	  }

	  originalRes.send( body );
	  originalRes.end();

	})*/
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});