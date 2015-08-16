var cards = require( 'node-of-cards' );
var _ = require( 'underscore' );

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

exports.testCards = function( req, res ) { 

  var reqCards = req.selectedCards;
  var returnCards = [];

  cards.draw( 
    {'number_of_cards': 52},

    function( err, data ) { 

      for ( var iter = 0 ; iter < reqCards.length ; iter++ ) { 

        var found = ( _.find( data.cards, function( card ) { 

          if ( card.code == reqCards[iter] ) { return true; }
        }));

        returnCards.push( found );
      }

      var output = { 'cards': returnCards };

      console.log( output );
      res.json( output );
    }
  );

}

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

exports.selectCards = function( req, res, next, cards ) { 

  req.selectedCards =  cards.split( ',' );
  next();
}