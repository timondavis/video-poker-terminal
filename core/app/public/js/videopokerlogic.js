var videoPokerLogic = function() { 

	this.cards = window.PokerBrain.cards;
	this.sorted = [];

	var that = this;

	this.Values = {

		'Royal_Flush':    	{ 'value': 500, 'composition': [], 'present': false },
		'Straight_Flush': 	{ 'value': 100, 'composition': [], 'present': false },
		'Four_of_a_Kind': 	{ 'value': 50,  'composition': [], 'present': false },
		'Straight': 	  	{ 'value': 30,  'composition': [], 'present': false },
		'Flush':			{ 'value': 25,  'composition': [], 'present': false },
		'Full_House':		{ 'value': 10, 	'composition': [], 'present': false },
		'Three_of_a_Kind':  { 'value': 5,   'composition': [], 'present': false },
		'Two_Pair': 		{ 'value': 2,   'composition': [], 'present': false },
		'Pair': 			{ 'value': 1,   'composition': [], 'present': false },
		'High_Card':      	{ 'value': 0,   'composition': [], 'present': false }
	}

	this.Init = function Init() { 

		that.sorted = _.toArray( this.cards );
		that.Sort();
	}

	this.Sort = function Sort() { 

		sortByValue();
	}

	function resetValues() { 

		$.each( this.Values, function( hand ) {

			hand.composition = [];
			hand.present = false;
		});
	}

	function scan_HighCard() {

		that.Values.High_Card.present = true;
		that.Values.High_Card.composition = [0];

		return true;
	}
	this.Scan_HighCard = function() { return scan_HighCard(); };

	function scan_RoyalFlush() { 

		var highValue = getValueRank( that.sorted[0].code );
		if ( highValue != 14 ) { return false; }

		if ( ! scan_StraightFlush() ) { return false; }

		that.Values.Royal_Flush.present = true;
		that.Values.High_Card.composition = [0, 1, 2, 3, 4];
		return true;
	}
	this.Scan_RoyalFlush = function() { return scan_RoyalFlush(); };

	function scan_StraightFlush() { 

		if ( scan_Straight() && scan_Flush() ) { 

			that.Values.Straight_Flush.present = true;
			that.Values.Straight_Flush.composition = [0, 1, 2, 3, 4];
			return true;
		}
		return false; 
	}
	this.Scan_StraightFlush = function() { return straightFlush(); }

	function scan_FourOfAKind() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 2 ; iter++ ) { 

			matchResults += seekMatches( iter );

			if ( matchResults.length == 4 ) { 

				that.Values.Four_of_a_Kind.present = true;
				that.Values.Four_of_a_Kind.composition = _.uniq( matchResults );

				return true; 
			}
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
			that.Values.Straight.composition = [0, 1, 2, 3, 4];
			return true;
		}

		return false; 
	}
	this.scan_Straight = function() { return scan_Straight(); }

	function scan_Flush() { 

		var flush = true;
		var initialSuit = getSuitCode( that.sorted[0].code );

		for ( var iter = 1 ; iter < that.sorted.length ; iter++ ) { 

			if ( getSuitCode( that.sorted[iter] ) != initialSuit ) { flush = false; }
		}

		if ( flush ) { 

			that.Values.Flush.present = true;
			that.Values.Straight.composition = [0, 1, 2, 3, 4];
			return true;
		}

		return false;
	}
	this.Scan_Flush = function() { return scan_Flush(); }

	function scan_FullHouse() { 

		if ( scan_ThreeOfAKind() && scan_Pair() ) { 

			// get the pair and 3oak positions
			var compositionTOAK = that.Values.Three_of_a_Kind.composition;
			var compositionPAIR = that.Values.Pair.composition;

			// bring them together and filter out duplicates (the 3ofakind cant be the same cards as pair)
			var compositionMerged = _.union( compositionTOAK, [compositionPAIR[0], compositionPAIR[1]] );
			compositionMerged = _.uniq( compositionMerged );

			if ( compositionMerged.length == 5 ) { 

				that.Values.Full_House.present = true;
				that.Values.Full_House.composition = [];
				return true;
			}

			if ( compositionPAIR.length > 2 ) { 

				compositionMerged = _.union( compositionTOAK, [compositionPAIR[2], compositionPAIR[3]] );
				compositionMerged = _.uniq( compositionMerged);

				if ( compositionMerged.length == 5 ) { 

					that.Values.Full_House.present = true;
					that.Values.Full_house.composition = [];
				}
			}
		}

		return false; 
	}
	this.Scan_FullHouse = function() { return scan_FullHouse(); }

	function scan_ThreeOfAKind() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 3 ; iter++ ) { 

			matchResults += seekMatches( iter );

			if ( matchResults.length >= 3 ) { 

				that.Values.Three_of_a_Kind.present = true;
				that.Values.Three_of_a_Kind.composition = _.uniq( matchResults );

				return true; 
			}
		}

		return false; 
	}
	this.Scan_ThreeOfAKind = function() { return scan_ThreeOfAKind(); };

	function scan_TwoPair() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 5 ; iter++ ) { 

			if ( seekMatches( iter ) >= 2 ) { 

				matchResults += seekMatches( iter );
			}
		}

		if ( _.uniq( matchResults.length >= 4 ) ) { 

			that.Values.Two_Pair.present = true;
			that.Values.Two_Pari.composition = _.uniq( matchResults );
			return true;
		}

		return false; 
	}
	this.Scan_TwoPair = function() { return scan_TwoPair(); }

	function scan_Pair() { 

		var matchResults = [];

		for ( var iter = 0 ; iter < 5 ; iter++ ) { 


			if ( seekMatches( iter ) >= 2 ) { 

				matchResults.push( seekMatches( iter ));

				that.Values.Pair.present = true;
				that.Values.Pair.composition = uniq( matchResults );
			}
		}

		if ( _.uniq( matchResults.length >= 2 ) ) { 

			return true;
		}

		return false; 
	}
	this.Scan_Pair = function() { return scan_Pair(); }

	function seekMatches( sortPos ) { 

		var cardVal = getValueCode( that.sorted[sortPos].code );
		var cardSuit = getSuitCode( that.sorted[sortPos].code );

		var hits = [];
		for( var iter = 0; iter < that.sorted.length ; iter++) {

			if ( getValueCode( that.sorted[iter].code ) == cardVal &&
				 getSuitCode( that.sorted[iter].code ) != cardSuit ) { 

				hits.push( iter );
			}
		}
		
		return hits;	
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
}

window.PokerBrain.Logic = new videoPokerLogic(); 
