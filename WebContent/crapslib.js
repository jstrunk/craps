var TABLEMIN = 5;
var TABLEMAX = 10000;
var POINTS = [4,5,6,8,9,10];
var CRAP = [2,3,12];
var NATURAL = [7,11];
var FIELD = [2,3,4,9,10,11,12];
var FIELDDBL = [2,12];
var ODDS = {
		4: 2,
		5: 3/2,
		6: 6/5,
		8: 6/5,
		9: 3/2,
		10: 2
};
var PLACEODDS = {
		4: 9/5,
		5: 7/5,
		6: 7/6,
		8: 7/6,
		9: 7/5,
		10: 9/5
};

var ODDSLIMIT = {
		4: 3,
		5: 4,
		6: 5,
		8: 5,
		9: 4,
		10: 3,
		off: 0
};
function dieroll(){
	return Math.floor(Math.random() * 6) + 1;
}
var STATUS = {
		balance: 100,
		totalbet: 0,
		die1: 3,
		die2: 4,
		dietotal: function(){
			return Number(STATUS.die1) + Number(STATUS.die2);},
		point: "off"
};

var Bet = function(args){
	/*
	 * Create a Bet object
	 * name: id of the bet
	 * win: function that returns true for a win given the die states
	 * lose: function that returns true for a loss given the die states
	 * other: function that performs an action if win and lose are false
	 * odds: function that returns the odds multiplier for a win
	 * max: function that returns maximum bet
	 * min: function that returns minimum bet
	 * keep: whether to keep the bet on the table after a win
	 * wager: current bet
	 * active: whether to consider this Bet or not.
	 * mutable: function to see if the bet is editable or not.
	 */
	this.name = args.name;
	this.wager = 0;
	this.active = false;
	this.win = args.win;
	this.lose = args.lose;
	this.other = (args.hasOwnProperty("other")) ? args.other : function(){};
	this.odds = (args.hasOwnProperty("odds")) ? args.odds : function(){return 1;};
	this.max = (args.hasOwnProperty("max")) ? args.max : function(){return TABLEMAX;};
	this.min = (args.hasOwnProperty("min")) ? args.min : function(){return TABLEMIN;};
	this.keep = (args.hasOwnProperty("keep")) ? args.keep : false;
	this.mutable = (args.hasOwnProperty("mutable")) ? args.mutable : function(){return true;};

	this.losebet = function(){
		STATUS.totalbet -= this.wager;
		this.wager = 0;
		this.active = false;
		$("input:text[name=" + this.name + "]").val("");
	};

	this.winbet = function(){
		console.log("won " + this.name + " with " + STATUS.dietotal() + ", wagered " + this.wager + ", odds " + this.odds() + " old balance " + STATUS.balance);
		if (this.keep) {
			STATUS.balance += Math.floor(this.wager * this.odds());
		} else {
			STATUS.totalbet -= this.wager;
			STATUS.balance += Math.floor(Number(this.wager) + Number(this.wager) * Number(this.odds()));
			this.wager = 0;
			this.active = false;
			$("input:text[name=" + this.name + "]").val("");
		}
	};

};

function simplewin(winners){
	// winners is an array of numbers that win
	return (winners.indexOf(STATUS.dietotal()) >= 0)? true : false;
}

function simplelose(winners){
	// winners is an array of numbers that win
	return (winners.indexOf(STATUS.dietotal()) < 0)? true : false;
}

var bets = {
		pass: new Bet({name:"pass",
			win: function(){ return (((STATUS.point === "off") && (NATURAL.indexOf(STATUS.dietotal()) >= 0)) || (STATUS.dietotal() === STATUS.point))? true : false;},
			lose: function(){ return (((STATUS.point === "off") && (CRAP.indexOf(STATUS.dietotal()) >= 0)) || (STATUS.dietotal() === 7))? true : false;},
			keep: true,
			mutable: function(){ return (STATUS.point != "off")? false : true;}}),
			passodds: new Bet({name: "passodds",
				win: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() === STATUS.point))? true : false;},
				lose: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() === 7))? true : false;},
				odds: function(){return ODDS[STATUS.dietotal()];},
				max: function(){return bets.pass.wager * ODDSLIMIT[STATUS.point];},
				min: function(){return bets.pass.wager;}}),
				dontpass: new Bet({name: "dontpass",
					win: function(){ return (((STATUS.point === "off") && ([2,3].indexOf(STATUS.dietotal()) >= 0)) || ((STATUS.point != "off") && (STATUS.dietotal() === 7)))? true : false;},
					lose: function(){ return (((STATUS.point === "off") && (NATURAL.indexOf(STATUS.dietotal()))) || (STATUS.dietotal() === STATUS.point))? true : false;},
					keep: true}),
					dontpassodds: new Bet({name: "dontpassodds",
						win: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() === 7))? true : false;},
						lose: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() === STATUS.point))? true : false;},
						odds: function(){return 1/ODDS[STATUS.dietotal()];},
						max: function(){return bets.dontpass.wager * 6;},
						min: function(){return bets.dontpass.wager;}}),
						field: new Bet({name: "field",
							win: function(){ return simplewin(FIELD);},
							lose: function(){ return simplelose(FIELD);},
							odds: function(){ return (FIELDDBL.indexOf(STATUS.dietotal()) < 0)? 2 : 1;}}),
							two: new Bet({name: "two",
								win: function(){ return simplewin([2]);},
								lose: function(){ return simplelose([2]);},
								odds: function(){ return 30;}}),
								twelve: new Bet({name: "twelve",
									win: function(){ return simplewin([12]);},
									lose: function(){ return simplelose([12]);},
									odds: function(){ return 30;}}),
									three: new Bet({name: "three",
										win: function(){ return simplewin([3]);},
										lose: function(){ return simplelose([3]);},
										odds: function(){ return 15;}}),
										eleven: new Bet({name: "eleven",
											win: function(){ return simplewin([11]);},
											lose: function(){ return simplelose([11]);},
											odds: function(){ return 15;}}),
											seven: new Bet({name: "seven",
												win: function(){ return simplewin([7]);},
												lose: function(){ return simplelose([7]);},
												odds: function(){ return 4;}}),
												craps: new Bet({name: "craps",
													win: function(){ return simplewin(CRAP);},
													lose: function(){ return simplelose(CRAP);},
													odds: function(){ return 7;}})
};

function crapout() { return ((STATUS.point != "off") && (STATUS.dietotal() == 7))? true : false;}
function pointwin () { return ((STATUS.point != "off") && (STATUS.dietotal() == this.point))? true : false;}

for (var i in POINTS) {
	bets["place" + POINTS[i]] = new Bet({name: "place" + POINTS[i],
		win: pointwin,
		lose: crapout,
		odds: function(){ return PLACEODDS[this.point];}});
	bets["place" + POINTS[i]].point = POINTS[i];
	bets["buy" + POINTS[i]] = new Bet({name: "buy" + POINTS[i],
		win: pointwin,
		lose: crapout,
		odds: function(){ return ODDS[this.point];}});
	bets["buy" + POINTS[i]].point = POINTS[i];
	bets["lay" + POINTS[i]] = new Bet({name: "lay" + POINTS[i],
		win: pointwin,
		lose: crapout,
		odds: function(){ return 1/ODDS[this.point];}});
	bets["lay" + POINTS[i]].point = POINTS[i];
	bets["come" + POINTS[i]] = new Bet({name: "come" + POINTS[i],
		win: pointwin,
		lose: crapout,
		mutable: function(){return false;}});
	bets["come" + POINTS[i]].point = POINTS[i];
	bets["dontcome" + POINTS[i]] = new Bet({name: "dontcome" + POINTS[i],
		win: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() == 7))? true : false;},
		lose: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() == this.point))? true : false;}});
	bets["dontcome" + POINTS[i]].point = POINTS[i];
	bets["come" + POINTS[i] + "odds"] = new Bet({name: "come" + POINTS[i] + "odds",
		win: pointwin,
		lose: crapout,
		odds: function(){ return ODDS[this.point];},
		min: function(){ return bets["come" + this.point].wager;},
		max: function(){ return bets["come" + this.point].wager * ODDSLIMIT[this.point];}});
	bets["come" + POINTS[i] + "odds"].point = POINTS[i];
	bets["dontcome" + POINTS[i] + "odds"] = new Bet({name: "dontcome" + POINTS[i] + "odds",
		win: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() == 7))? true : false;},
		lose: function(){ return ((STATUS.point != "off") && (STATUS.dietotal() == this.point))? true : false;},
		odds: function(){ return 1/ODDS[this.point];},
		min: function(){ return bets["come" + this.point].wager;},
		max: function(){ return bets["come" + this.point].wager * 6;}});
	bets["dontcome" + POINTS[i] + "odds"].point = POINTS[i];
}

var betsorder = [];
for (key in bets){ betsorder.push(key); }

function movebet(type, point) {
	if (bets[type + point].wager != 0){
		console.log("error: " + type + point + " does not equal 0");
	}
	bets[type + point].wager = bets[type].wager;
	bets[type + point].active = true;
	bets[type].wager = 0;
	bets[type].active = false;
	$("input:text[name=" + type + point + "]").val(bets[type + point].wager);
	$("input:text[name=" + type + "]").val("");
}

bets.come = new Bet({name: "come",
	win: function(){ return (NATURAL.indexOf(STATUS.dietotal()) >= 0)? true : false;},
	lose: function(){ return (CRAP.indexOf(STATUS.dietotal()) >= 0)? true : false;},
	keep: true,
	other: function(){ if (POINTS.indexOf(STATUS.dietotal()) >= 0){ movebet("come", STATUS.dietotal());}}});
bets.dontcome = new Bet({name: "dontcome",
	win: function(){ return ([2,3].indexOf(STATUS.dietotal()) >= 0)? true : false;},
	lose: function(){ return (NATURAL.indexOf(STATUS.dietotal()) >= 0)? true : false;},
	keep: true,
	other: function(){ if (POINTS.indexOf(STATUS.dietotal()) >= 0){ movebet("dontcome", STATUS.dietotal());}}});

betsorder.push("come");
betsorder.push("dontcome");

function processbets(){
	for	(b in bets){
		if (bets[b].active){
			if (bets[b].win()) {
				bets[b].winbet();
			} else if (bets[b].lose()) {
				bets[b].losebet();
			} else {
				bets[b].other();
			}
		}
	}
}
