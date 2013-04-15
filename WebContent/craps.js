var DIEFACES = {1:"-42px -42px", 2:"-120px -42px", 3:"-199px -42px",4:"-278px -42px",5:"-357px -42px",6:"-436px -42px"};
var POINTLOC = {
off: {'background-position': "0px -20px",
left: "20px",
top:"20px"},
4: {'background-position': "0px 0px",
left: "185px",
top: "42px"},
5: {'background-position': "0px 0px",
left: "247px",
top: "42px"},
6: {'background-position': "0px 0px",
left: "309px",
top: "42px"},
8: {'background-position': "0px 0px",
left: "371px",
top: "42px"},
9: {'background-position': "0px 0px",
left: "433px",
top: "42px"},
10: {'background-position': "0px 0px",
left: "495px",
top: "42px"}};

var CHIPS = {
pass: {left: "356px",
top: "307px"},
dontpass: {left: "382px",
top: "268px"},
field: {left: "244px",
top: "231px"},
big6: {left: "92px",
top: "218px"},
big8: {left: "132px",
top: "258px"},
come: {left: "380px",
top: "155px"},
dontcome: {left: "127px",
top: "63px"},
lay4: {left: "180px",
top: "35px"},
lay5: {left: "242px",
top: "35px"},
lay6: {left: "304px",
top: "35px"},
lay8: {left: "366px",
top: "35px"},
lay9: {left: "428px",
top: "35px"},
lay10: {left: "490px",
top: "35px"},
buy4: {left: "170px",
top: "50px"},
buy5: {left: "232px",
top: "50px"},
buy6: {left: "294px",
top: "50px"},
buy8: {left: "356px",
top: "50px"},
buy9: {left: "418px",
top: "50px"},
buy10: {left: "480px",
top: "50px"},
place4: {left: "195px",
top: "118px"},
place5: {left: "257px",
top: "118px"},
place6: {left: "319px",
top: "118px"},
place8: {left: "381px",
top: "118px"},
place9: {left: "443px",
top: "118px"},
place10: {left: "505px",
top: "118px"},
come4: {left: "174px",
top: "98px"},
come5: {left: "236px",
top: "98px"},
come6: {left: "298px",
top: "98px"},
come8: {left: "360px",
top: "98px"},
come9: {left: "422px",
top: "98px"},
come10: {left: "484px",
top: "98px"},
dontcome4: {left: "200px",
top: "70px"},
dontcome5: {left: "262px",
top: "70px"},
dontcome6: {left: "324px",
top: "70px"},
dontcome8: {left: "386px",
top: "70px"},
dontcome9: {left: "450px",
top: "70px"},
dontcome10: {left: "510px",
top: "70px"},
seven: {left: "625px",
top: "129px"},
hard6: {left: "621px",
top: "188px"},
hard10: {left: "690px",
top: "189px"},
hard8: {left: "629px",
top: "233px"},
hard4: {left: "696px",
top: "231px"},
three: {left: "580px",
top: "275px"}, 
two: {left: "668px",
top: "277px"},
twelve: {left: "733px",
top: "277px"},
eleven: {left: "626px",
top: "322px"},
craps: {left: "663px",
top: "359px"},		
};

$(document).ready(function(){
	var updateshow = function(field,  newval){
		$("#" + field).html(newval);
		return newval;
	};
	
	var updatedie = function(field,  newval){
		$("#" + field).css("background-position", DIEFACES[newval]);
	};
	
	var updatepoint = function(field, newval){
		$("#" + field).css(POINTLOC[newval]);
	};
	
	function updatestate() {
		updateshow("balance", STATUS.balance);
		updateshow("totalbet", STATUS.totalbet);
		updatedie("die1", STATUS.die1);
		updatedie("die2", STATUS.die2);
		updatepoint("point", STATUS.point);
	}
	
	/*
	STATUS.watch("balance", updateshow);
	STATUS.watch("totalbet", updateshow);
	STATUS.watch("die1", updatedie);
	STATUS.watch("die2", updatedie);
	STATUS.watch("point", updatepoint);
	*/
	
	updatestate();
	
	$('img[usemap]').rwdImageMaps();

	$(".bet input:text").change(function(){
		var wager = $(this).val();
		if (!wager){
			wager = 0;
		}
		var change = wager - bets[$(this).attr("name")].wager;
		if (!bets[$(this).attr("name")].mutable()){
			console.log("This bet may not be changed at this time.");
			$(this).val(bets[$(this).attr("name")].wager);
		} else if (wager > bets[$(this).attr("name")].max()) {
			console.log("This bet will exceed the maximum for this wager of $" + bets[$(this).attr("name")].max());
			$(this).val(bets[$(this).attr("name")].wager);
		} else if ((wager < bets[$(this).attr("name")].min()) && (wager != 0)) {
			console.log("This bet will not meet the minimum for this wager of $" + bets[$(this).attr("name")].min());
			$(this).val(bets[$(this).attr("name")].wager);
		} else if ((STATUS.balance - change) < 0){
			console.log("insufficient funds");
			$(this).val(bets[$(this).attr("name")].wager);
		} else {
			if ($(this).attr("name").match("buy")){
				// charge 5% commission
				STATUS.balance -= Math.ceil(wager * .05);
			}
			bets[$(this).attr("name")].wager = wager;
			bets[$(this).attr("name")].active = true;
			STATUS.totalbet += change;
			STATUS.balance -= change;
		};
	});
	
	$(".wager").click(function(){
		alert($(this).attr("name"));
	});
	
	$("#dice").click(function(){
		STATUS.die1 = dieroll();
		STATUS.die2 = dieroll();
		console.log(STATUS.dietotal());
		processbets();
		if (STATUS.point === "off"){
			if (POINTS.indexOf(STATUS.dietotal()) >= 0){
				STATUS.point = STATUS.dietotal();
			}
		} else if ((STATUS.point === STATUS.dietotal()) || (STATUS.dietotal() === 7)) {
				STATUS.point = "off";
		}
		console.log(STATUS.point);
		updatestate();
	});

});