$(document).ready( function($) { 

  var brain = window.PokerBrain;

  $.ajax( 'poker/deck/new',
    {
      'dataType': 'json',
      'crossDomain': false,
      'success' : function( data, status, req ) { 

        drawCards();
      }
    }
  );

  $( '.btn-bet' ).click( evtBetClicked );
  $( '.btn-draw' ).click( evtDrawClicked );

});

// This is the global manager for the game.
window.PokerBrain = {
  cards: {},
  cardback: 'public/asset/image/cardback.png'
};

var drawCards = function drawCards( numCards ) {

  // $.ajax( 'poker/deck/1/draw/5/1',
  var hand = 'AS,AC,KS,4C,KD';
  $.ajax( 'poker/test/' + hand,
    {
      'dataType': 'json',
      'crossDomain': false,
      'success':  function( data, status, req ) { 

        writeNewHand( data );
        renderCards();
        initCards();
        window.PokerBrain.Logic.Init();
      }
    }
  );

}

function writeNewHand( data ) {

  var positionName = '';

  // Put all the cards from the API call into the 
  for( var iter = 0 ; iter < data.cards.length ; iter++ ) { 
    positionName = 'pos_' + ( iter + 1 );
    PokerBrain.cards[positionName] = data.cards[iter];
  }
}

function renderCards() { 

  renderCard( 1, PokerBrain.cards.pos_1 );
  renderCard( 2, PokerBrain.cards.pos_2 );
  renderCard( 3, PokerBrain.cards.pos_3 );
  renderCard( 4, PokerBrain.cards.pos_4 );
  renderCard( 5, PokerBrain.cards.pos_5 );

  $( '.card-placeholder' ).removeClass( 'flipped' );
  $( '.card-placeholder' ).addClass( 'faceup' );
}

function renderCard( pos_id, card ) {

  var place = $( '#card-' + pos_id );

  var cardString = '';
  cardString += '<div data-card-code="' + card.code + '" data-card-pref="keep" data-card-image="' + card.image + '" data-card-pos="' + pos_id + '" class="a-card">';
    cardString += '<img src="' + card.image + '" alt="' + card.value + ' of ' + card.suit + '" />';
  cardString += '</div>';

  place.html( cardString );
}

function flipCard( pos_id ) { 

  var card = $('[data-card-pos="' + pos_id + '"]');
  var pref = card.attr( 'data-card-pref' ); 

  if ( pref == 'keep' ) { stageCardForDiscard( card ); }
  else { stageCardForKeeping( card ); }
}

function stageCardForKeeping( card ) { 

  card.attr( 'data-card-pref', 'keep' );
  card.removeClass( 'flipped' );
  card.addClass( 'faceup' );
  var image = card.children( 'img' );

  setTimeout( function() { 
    image.attr( 'src', card.attr( 'data-card-image' ) );
  }, 500 );
}

function stageCardForDiscard( card ) { 

  card.attr( 'data-card-pref', 'discard' );
  card.addClass( 'flipped' );
  card.removeClass( 'faceup' );
  var image = card.children( 'img' );

  setTimeout( function() { 
    image.attr( 'src', PokerBrain.cardback )
  }, 500 );
}

function initCards() { 

  var cards = $( '.a-card' );

  cards.off( 'click' );
  cards.click( function( e ) { 

    var position = $( this ).attr( 'data-card-pos' );
    flipCard( position );
    initCards();
  });
}

function bet() { 

  setBetButtonsEnabled( false );
  setDrawButtonEnabled( true );
}

function setBetButtonsEnabled( swtch ) { 

  if ( swtch ) { 
    $( '.btn-bet' ).attr( 'disabled', false );
  } else {

    $( '.btn-bet' ).attr( 'disabled', true ); 
  }
}

function draw() {

  var numFlippedCards = countFlippedCards();

  $.ajax( 'poker/deck/1/draw/' + numFlippedCards + '/1',
    {
      'dataType': 'json',
      'crossDomain': false,
      'success':  function( data, status, req ) { 

        for ( var iter = 0 ; iter < data.cards.length ; iter++ ) { 

          replaceFlipped( data.cards[iter], iter );
        }

        renderCards();
        initCards();
      }
    }
  );  

  setBetButtonsEnabled( true );
  setDrawButtonEnabled( false );
}

function setDrawButtonEnabled( swtch ) { 

  if ( swtch ) { 
    $( '.btn-draw' ).attr( 'disabled', false );
  } else { 
    $( '.btn-draw' ).attr( 'disabled', true );
  }
}

function replaceFlipped( card, flippedPosition ) { 

  var flipped = $( '.flipped' );
  var flippedPosInBrain = $( flipped[flippedPosition] ).attr( 'data-card-pos' );
  var position = 'pos_' + flippedPosInBrain;

  window.PokerBrain.cards[position] = card;
}

function countFlippedCards() { 

  return $( '.flipped' ).length;
}

function evtDrawClicked( e ) { 

  draw();
}

function evtBetClicked( e ) { 

  bet();
}

