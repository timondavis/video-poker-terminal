var index = require( '../controller/index.server.controller' );
var express = require( 'express' );

module.exports = function ( app ) {

  app.get( '/', index.render );
  app.get( '/public', express.static( '/core/app/public/') );
}