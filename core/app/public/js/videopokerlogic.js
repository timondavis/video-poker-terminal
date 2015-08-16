var videoPokerLogic = function() { 

	this.cards = window.PokerBrain.cards;
	this.sorted = [];

	var that = this;

	this.Values = {

		'Royal_Flush':    	{ 'name': 'Royal Flush',     'value': 500, 'composition': [], 'present': false },
		'Straight_Flush': 	{ 'name': 'Straight Flush',  'value': 100, 'composition': [], 'present': false },
		'Four_of_a_Kind': 	{ 'name': 'Four of a Kind',  'value': 50,  'composition': [], 'present': false },
		'Full_House':		{ 'name': 'Full House',      'value': 25,  'composition': [], 'present': false },
		'Flush':			{ 'name': 'Flush',           'value': 15,  'composition': [], 'present': false },
		'Straight': 	  	{ 'name': 'Straight',        'value': 10,  'composition': [], 'present': false },
		'Three_of_a_Kind':  { 'name': 'Three of a Kind', 'value': 5,   'composition': [], 'present': false },
		'Two_Pair': 		{ 'name': 'Two Pair',        'value': 2,   'composition': [], 'present': false },
		'Pair': 			{ 'name': 'Pair',            'value': 1,   'composition': [], 'present': false },
		'High_Card':      	{ 'name': 'High Card',       'value': 0,   'composition': [], 'present': false }
	}

	this.Init = function Init() { 

		that.sorted = _.toArray( this.cards );
		that.Sort();
	}

	this.Scan = function Scan() { 

		resetValues();

		scan_RoyalFlush();
		scan_StraightFlush();
		scan_FourOfAKind();
		scan_FullHouse();
		scan_Flush();
		scan_Straight();
		scan_ThreeOfAKind();
		scan_TwoPair();
		scan_Pair();
		scan_HighCard();

		var winners = _.filter( that.Values, function( item ) { 

			return ( item.present )
		});

		_.sortBy( winners, function( item ) { 

			return item.value;
		});

		return winners;
	}

	this.Sort = function Sort() { 

		sortByValue();
	}

	function resetValues() { 

		_.each( that.Values, function( hand ) {

			hand.composition = [];
			hand.present = false;
		});
	}

	function scan_HighCard() {

		var targetSuit = that.sorted[0].suit;
		var targetValue = that.sorted[0].value;

		var targetPos = 0;


		for ( var iter = 1 ; iter <= that.sorted.length ; iter++) { 

			var invoker = 'pos_' + iter;

			if ( that.cards[invoker].suit == targetSuit &&
				 that.cards[invoker].value == targetValue ) { 

				targetPos = iter;	
			}
		}

		that.Values.High_Card.present = true;
		that.Values.High_Card.composition = [[targetPos]];

		return true;
	}
	this.Scan_HighCard = function() { return scan_HighCard(); };

	function scan_RoyalFlush() { 

		var highValue = getValueRank( that.sorted[0].code );
		if ( highValue != 14 ) { return false; }

		if ( ! scan_StraightFlush() ) { return false; }

		that.Values.Royal_Flush.present = true;
		that.Values.Royal_Flush.composition = [[1, 2, 3, 4, 5]];
		return true;
	}
	this.Scan_RoyalFlush = function() { return scan_RoyalFlush(); };

	function scan_StraightFlush() { 

		if ( scan_Straight() && scan_Flush() ) { 

			that.Values.Straight_Flush.present = true;
			that.Values.Straight_Flush.composition = [[1, 2, 3, 4, 5]];
			return true;
		}
		return false; 
	}
	this.Scan_StraightFlush = function() { return scan_StraightFlush(); }

	function scan_FourOfAKind() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 5 ; iter++ ) { 

			if ( seekMatches( iter ).length == 4 ) { 

				matchResults.push( seekMatches( iter ));
			}
		}

		if ( matchResults.length >= 1 ) { 

			that.Values.Four_of_a_Kind.present = true;
			that.Values.Four_of_a_Kind.composition = cleanComposition( matchResults );
			return true;
		}

		return false;
	}

	this.Scan_FourOfAKind = function() { return scan_FourOfAKind(); }

	function scan_Straight() { 

		var values = [];

		for ( var iter = 0 ; iter < that.sorted.length ; iter++ ) { 

			values.push( getValueRank( that.sorted[iter].code ) );
		}

		if ( values[0] == ( values[1] + 1 ) &&
			 values[1] == ( values[2] + 1 ) &&
			 values[2] == ( values[3] + 1 ) &&
			 values[3] == ( values[4] + 1 ) )
		{
			that.Values.Straight.present = true;
			that.Values.Straight.composition = [[1, 2, 3, 4, 5]];
			return true;
		}

		return false; 
	}
	this.Scan_Straight = function() { return scan_Straight(); }

	function scan_Flush() { 

		var flush = true;
		var initialSuit = getSuitCode( that.sorted[0].code );

		for ( var iter = 1 ; iter < that.sorted.length ; iter++ ) { 

			if ( getSuitCode( that.sorted[iter].code ) != initialSuit ) { flush = false; }
		}

		if ( flush ) { 

			that.Values.Flush.present = true;
			that.Values.Flush.composition = [[1, 2, 3, 4, 5]];
			return true;
		}

		return false;
	}
	this.Scan_Flush = function() { return scan_Flush(); }

	function scan_FullHouse() { 

		if ( scan_ThreeOfAKind() && scan_Pair() ) { 

			that.Values.Full_House.present = true;
			that.Values.Full_House.composition = [[1, 2, 3, 4, 5]];

			return true;
		}

		return false; 
	}
	this.Scan_FullHouse = function() { return scan_FullHouse(); }

	function scan_ThreeOfAKind() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 5 ; iter++ ) { 

			if ( seekMatches( iter ).length == 3 ) { 

				matchResults.push( seekMatches( iter ));
			}
		}

		if ( matchResults.length >= 1 ) { 

			that.Values.Three_of_a_Kind.present = true;
			that.Values.Three_of_a_Kind.composition = cleanComposition( matchResults );
			return true;
		}

		return false; 
	}
	this.Scan_ThreeOfAKind = function() { return scan_ThreeOfAKind(); };

	// Scan hand for instances of Two Pairs.
	function scan_TwoPair() { 

		scan_Pair();

		if ( that.Values.Pair.present && that.Values.Pair.composition.length == 2 ) {

			that.Values.Two_Pair.present = true;	
			that.Values.Two_Pair.composition = that.Values.Pair.composition;
			return true;
		}

		return false;
	}
	this.Scan_TwoPair = function() { return scan_TwoPair(); }

	// Scan hand for instances of a pair.
	function scan_Pair() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 5 ; iter++ ) { 

			if ( seekMatches( iter ).length == 2 ) { 

				matchResults.push( seekMatches( iter ));
			}
		}

		if ( matchResults.length >= 1 ) { 

			that.Values.Pair.present = true;
			that.Values.Pair.composition = cleanComposition( matchResults );
			return true;
		}

		return false; 
	}
	this.Scan_Pair = function() { return scan_Pair(); }

	function seekMatches( sortPos, byDisplayPosition ) { 

		if ( typeof byDisplayPosition === 'undefined' ) { 

			byDisplayPosition = true;
		}

		var cardVal = getValueCode( that.sorted[sortPos].code );
		var cardSuit = getSuitCode( that.sorted[sortPos].code );

		var hits = [];
		var handSize = _.toArray( that.cards ).length;

		if ( byDisplayPosition ) { 

			for( var iter = 1 ; iter <= handSize ; iter++) {

				var invocation = 'pos_' + iter;
	
				if ( getValueCode( that.cards[invocation].code ) == cardVal ) {
	
					hits.push( iter );
				}
			}
		}
		else { 

			for( var iter = 0 ; iter < that.sorted.length ; iter++) {
	
				if ( getValueCode( that.sorted[iter].code ) == cardVal ) {
	
					hits.push( iter );
				}
			}
		}
		
		return hits;	
	}

	function cleanComposition( composition ) { 

		for( var iterWrapper = 0 ; iterWrapper < composition.length ; iterWrapper++ ) { 

			composition[iterWrapper].sort();
		}

		for( var iterWrapper = 0 ; iterWrapper < composition.length ; iterWrapper++ ) { 

			for ( var iterParallel = 0; iterParallel < composition.length ; iterParallel++ ) {

				if ( arrEquals( composition[iterWrapper], composition[iterParallel])) { 

					composition.splice( iterParallel, 1);	
				}
			}
		}

		return composition;
	}

	// sort cards by value
	function sortByValue() { 

		that.sorted = _.sortBy( that.sorted , function( card ) { 

			switch ( getValueCode( card.code ) ) { 

				case '2': 
					return 14;
					break;
				case '3':
					return 13;
					break;
				case '4':
					return 12;	
					break;
				case '5':
					return 11;
					break;
				case '6':
					return 10;
					break;
				case '7':
					return 9;
					break;
				case '8':
					return 8;
					break;
				case '9':
					return 7;
					break;
				case '0': 
					return 6; 
					break;
				case 'J':
					return 5;
					break;
				case 'Q': 
					return 4;
					break;
				case 'K': 
					return 3;
					break;
				case 'A':
					return 2;
					break;
				default: 
					break;
			}
		});
	}

	// Sort cards by suit
	// defunct
	function sortBySuit() { 

		this.sorted = _.sortBy( this.sorted, function( card ) { 

			switch ( getSuitCode( card.code ) )  { 

				case S: 
					return 1;
					break;
				case C:
					return 2;
					break;
				case D: 
					return 3;
					break;
				case H:
					return 4;
					break;
				default:
					break;
			}
		});
	};

	function getSuitCode( code ) { 

		return code.substring( 1 );
	}

	function getValueCode( code ) { 

		return code.substring( 0, 1 );
	}

	function getValueRank( code ) { 

		switch( getValueCode( code ) ) {
				case '2': 
					return 2;
					break;
				case '3':
					return 3;
					break;
				case '4':
					return 4;	
					break;
				case '5':
					return 5;
					break;
				case '6':
					return 6;
					break;
				case '7':
					return 7;
					break;
				case '8':
					return 8;
					break;
				case '9':
					return 9;
					break;
				case '0': 
					return 10; 
					break;
				case 'J':
					return 11;
					break;
				case 'Q': 
					return 12;
					break;
				case 'K': 
					return 13;
					break;
				case 'A':
					return 14;
					break;
				default: 
					break;
		}
	}

	function arrEquals( arr1, arr2 ) { 

		if ( arr1.length != arr2.length ) { return false; }
		var hasIntegrity = true;

		for ( var iter = 0 ; iter < arr1.length ; iter++ ) {

			if( arr1[iter] != arr2[iter] ) { hasIntegrity = false; break; }	
		}

		return hasIntegrity;
	}
}

window.PokerBrain.Logic = new videoPokerLogic(); 
