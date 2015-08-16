var cards = require( 'node-of-cards' );

exports.newDeck = function( req, res ) { 

  cards.shuffle(function( err, data ) {

    res.json( data ); 
  });
};

exports.drawCards = function( req, res ) { 

  var player_id = req.toPlayer;
  var deckID = req.deckID;
  var numberOfCards = req.numberOfCards;

  cards.draw( 

    { 'number_of_cards': numberOfCards, 'deck_id': deckID }, 

    function( err, data ) {

      if ( err ) { 

        throw err.message;
      }

      var newCards = data.cards;      

      data.cards = newCards;
      res.json( data );
    }
  );
};


exports.numberOfCards = function( req, res, next, numCards ) { 

  req.numberOfCards = numCards;
  next();
};

exports.deckID = function( req, res, next, id ) { 

  req.deckID = id;
  next();
}

exports.toPlayer = function( req, res, next, id ) { 

  req.toPlayer = id;
  next();
}