var express = require('express');
var app = express();
var apiRequest = require('sync-request');
var Cache = require( 'tiny-cache' );
//var localStorage = require('localStorage');
var md5 = require('js-md5')
var localCache = new Cache();

var http = require('http');

var https = require('https');
var key = process.env.POIJU_SSL_KEY; //key.pem
var cert = process.env.POIJU_SSL_CERT; //cert.pem

var https_options = {
    key: key,
    cert: cert
};

//localStorage.clear();

// Set cache on:
var cacheOn = true;


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	var localApi = request.protocol + '://' + request.get('host') + '/api'
	console.log( localApi )
	response.render('pages/index' , { localApi : localApi });
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

	var apiUrlHash = md5( apiUrl )

	// Load response from cache:
	var response = cacheOn ? localCache.getItem( apiUrlHash ) : undefined;

	if ( response ) {
		console.log( "From cache: " + apiUrlHash )
		originalRes.send( response )
	}

	else {
		res = apiRequest('GET', apiUrl , {
		  'timeout': 10000
		});

		if ( res.statusCode = 200 ) {
			response = res.getBody();

			// Cache response:
			if ( cacheOn ) {
				console.log( "Store to cache" )
				localCache.setItem( apiUrlHash , response );
			}

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

//http.createServer(app).listen(process.env.PORT || 5000);
https.createServer(https_options, app).listen(process.env.PORT || 5000);