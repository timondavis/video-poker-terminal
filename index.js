var express = require( './core/server/config/express.js' );

var app = express();

app.listen( 3000 );
module.exports = app;

console.log( '-------------------------------------------' );
console.log( 'Video Poker Terminal listening on port 3000' );
console.log( '-------------------------------------------' );
