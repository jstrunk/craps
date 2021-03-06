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
come4: {left: 174,
top: 88},
come5: {left: 236,
top: 88},
come6: {left: 298,
top: 88},
come8: {left: 360,
top: 88},
come9: {left: 422,
top: 88},
come10: {left: 484,
top: 88},
dontcome4: {left: 190,
top: 70},
dontcome5: {left: 252,
top: 70},
dontcome6: {left: 314,
top: 70},
dontcome8: {left: 376,
top: 70},
dontcome9: {left: 440,
top: 70},
dontcome10: {left: 500,
top: 70}	
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
	
	updatestate();
	
	function enterwager(betname, e){
		if (!bets[betname].mutable()){
			betname += "odds";
		}
		$("#betname").html(betname);
		$("input[name=wager]").val(bets[betname].wager);
		$("#wagerentry").css({top: e.pageY + "px", left: e.pageX + "px"});
		$("#wagerentry").show();
		$("input[name=wager]").focus();
		$("input[name=wager]").select();
	}
	
	function showbet(betname) {
		var chips = $('.chips[name="' + betname + '"]');
		if (bets[betname].active){
			if (chips.length){ //chips div for this bet already exists
				chips.html(bets[betname].wager);
			} else {
				$("#tablediv").append('<div class="chips" name="' + betname + '">' + bets[betname].wager + '</div>');
				chips = $('.chips[name="' + betname + '"]');
				if (/odds$/.test(betname)){
					var coords = $('.chips[name="' + betname.slice(0,betname.length - 4) + '"]').position();
					chips.css({top: (coords.top - 10) + "px", left: (coords.left + 10) + "px"});
				} else if (/come[0-9]/.test(betname)) {
					var coords = $("#tablediv").position();
					chips.css({top: (coords.top + CHIPS[betname].top) + "px", left: (coords.left + CHIPS[betname].left) + "px"});
				} 
				else {
					chips.css($("#wagerentry").css(["top", "left"]));
				}
				chips.click(function(){
					var coords = chips.position();
					enterwager(betname, {pageX: coords.left, pageY: coords.top});
				});
			}
			
		} else {
			chips.detach();
		}
	}
	
	function placebet(betname,wager){
		if (!wager){
			wager = 0;
		}
		wager = Number(wager);
		var change = wager - bets[betname].wager;
		if (!bets[betname].mutable()){
			alert("This bet may not be changed at this time.");
			$("input[name=wager]").val(bets[betname].wager);
		} else if (wager > bets[betname].max()) {
			alert("This bet will exceed the maximum for this wager of $" + bets[betname].max());
			$("input[name=wager]").val(bets[betname].wager);
		} else if ((wager < bets[betname].min()) && (wager != 0)) {
			alert("This bet will not meet the minimum for this wager of $" + bets[betname].min());
			$("input[name=wager]").val(bets[betname].wager);
		} else if ((STATUS.balance - change) < 0){
			alert("insufficient funds");
			$("input[name=wager]").val(bets[betname].wager);
		} else {
			if (betname.match("buy")){
				// charge 5% commission
				STATUS.balance -= Math.ceil(wager * .05);
			}
			bets[betname].wager = wager;
			bets[betname].active = (wager > 0)? true: false;
			STATUS.totalbet += change;
			STATUS.balance -= change;
			showbet(betname);
		};
	}

	$(".wager").click(function(e){
		var betname = $(this).attr("name");
		enterwager(betname, e);
	});
	

	
	$("#wagermin").click(function(){
		var betname = $("#betname").html();
		$("input[name=wager]").val(bets[betname].min());
	});
	
	$("#wagermax").click(function(){
		var betname = $("#betname").html();
		$("input[name=wager]").val(bets[betname].max());
	});
	
	function wagervalidate(input){
		var betname = $("#betname").html();
		var val = Math.floor(input.val().replace(/\D/g, ''));
		val = (val > bets[betname].max())? bets[betname].max(): val;
		val = ((val != 0) && (val < bets[betname].min()))? bets[betname].min(): val;
		var changed = (Number(input.val()) === Number(val));
		input.val(val);
		return changed;
	}
	
	$("#wagerbet").click(function(){
		if (wagervalidate($("input[name=wager]"))) {
			$("input[name=wager]").css('background-color', "white");
		placebet($("#betname").html(),$("input[name=wager]").val());
		$("#wagerentry").hide();
		updatestate();
		} else {
			$("input[name=wager]").css('background-color', "yellow");
		}
	});
	
	$("input[name=wager]").keypress(function(e){
		if (event.which === 13){
			if (wagervalidate($(this))) {
				$(this).css('background-color', "white");
			placebet($("#betname").html(),$("input[name=wager]").val());
			$("#wagerentry").hide();
			updatestate();
			} else{
				$(this).css('background-color', "yellow");
			}
			
		}
	});
		
	$("#dice").click(function(){
		if (bets.pass.active || bets.dontpass.active){
			STATUS.die1 = dieroll();
			STATUS.die2 = dieroll();
			processbets();
			if (STATUS.point === "off"){
				if (POINTS.indexOf(STATUS.dietotal()) >= 0){
					STATUS.point = STATUS.dietotal();
				}
			} else if ((STATUS.point === STATUS.dietotal()) || (STATUS.dietotal() === 7)) {
				STATUS.point = "off";
			}
			for (var i in bets){
				showbet(bets[i].name);
			}
			updatestate();
		} else {
			alert("You must bet on at least the Pass Line or Don't Pass Line.");
		}
	});

});