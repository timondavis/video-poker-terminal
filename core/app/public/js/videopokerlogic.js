var videoPokerLogic = function() { 

	this.cards = window.PokerBrain.cards;
	this.sorted = [];
	var that = this;


	this.Values = {

		'High_Card':      	{ 'value': 0,   'composition': [], 'present': false },
		'Royal_Flush':    	{ 'value': 500, 'composition': [], 'present': false },
		'Straight_Flush': 	{ 'value': 100, 'composition': [], 'present': false },
		'Four_of_a_Kind': 	{ 'value': 50,  'composition': [], 'present': false },
		'Straight': 	  	{ 'value': 30,  'composition': [], 'present': false },
		'Flush':			{ 'value': 25,  'composition': [], 'present': false },
		'Three_of_a_Kind':  { 'value': 5,   'composition': [], 'present': false },
		'Two_Pair': 		{ 'value': 2,   'composition': [], 'present': false },
		'Pair': 			{ 'value': 1,   'composition': [], 'present': false }
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

		this.Values.High_Card.present = true;
		this.Values.High_Card.composition = [];
	}

	function scan_RoyalFlush() { 

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
}

window.PokerBrain.Logic = new videoPokerLogic(); 