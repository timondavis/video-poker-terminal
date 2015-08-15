var cards = require( '../controller/cards.server.controller' );

module.exports = function( app ) { 

  app.get( '/poker/deck/new', cards.newDeck );
  app.get( '/poker/deck/:deck_id/draw/:number_of_cards/:to_player', cards.drawCards );


  app.param( 'number_of_cards', cards.numberOfCards );
  app.param( 'deck_id', cards.deckID );
  app.param( 'to_player', cards.toPlayer );
}


