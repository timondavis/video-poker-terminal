$(document).ready( function($) { 

  $( '#btn-new-deck' ).click( newDeck );
  $( '#btn-draw-5' ).click( drawCards );
});

// This is the global manager for the game.
window.PokerBrain = {

  deckID : "-1" 
};

var brain = window.PokerBrain;

var newDeck = function newDeck() { 

  $.ajax( 'poker/deck/new',
    {
      'dataType': 'json',
      'crossDomain': false,
      'success' : function( data, status, req ) { 

        brain.deckID = data.deck_id;
      }
    }
  );
}

var drawCards = function drawCards( numCards ) {

  var deck_id = window.PokerBrain.deckID;

  $.ajax( 'poker/deck/' + deck_id + '/draw/5/1',
    {
      'dataType': 'json',
      'crossDomain': false,
      'success':  function( data, status, req ) { 

        alert( JSON.stringify( data ) );
      }
    }
  );
}

