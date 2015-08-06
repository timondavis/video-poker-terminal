var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(3000);

console.log( 'Video Poker Terminal now listening on port 3000' );