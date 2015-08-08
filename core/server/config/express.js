var express = require( 'express' ),
    compress = require( 'compress' ),
    bodyParser = require( 'body-parser' ),
    methodOverride = require( 'method-override' ),
    session = require( 'express-session' );

module.exports = function () { 

  var app = express();

  if ( process.env.NODE_ENV === 'development' ) { 

    app.use( morgan( 'dev' ) );
  } else if ( process.env.NODE_ENV === 'production' ) { 

    app.use( compress() );
  }

  app.use( bodyParser.urlencoded({
    'extended' : true
  }));

  app.use( bodyParser.json() );
  app.use( methodOverride() );

  app.set( 'views', 'core/server/view' );
  app.set( 'view engine', 'jade' );

  require( '../route/index.server.route.js' )( app );

  app.use( '/public', express.static( 'core/app/public' ));

  return app;
}
