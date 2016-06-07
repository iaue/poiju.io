var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


var ProxyCache = require( 'node-proxy-cache' ),
    proxyCache = new ProxyCache({}),
    DS = {};
    
proxyCache.when( /mapbox/, {
    cacheTime: function( cacheEntry, req, proxyRes ) {
    	console.log( "cached request" )
        return 0; // cache forever
    }  
});
 
proxyCache.listen( 9000 ); // listen on port

console.log( "proxy started" )