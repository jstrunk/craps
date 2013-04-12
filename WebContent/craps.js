$(document).ready(function(){
	var updateshow = function(field, oldval, newval){
		$("#" + field).html(newval);
		return newval;
	};
	
	updateshow("balance", 0, STATUS.balance);
	updateshow("totalbet", 0, STATUS.totalbet);
	updateshow("die1", 0, STATUS.die1);
	updateshow("die2", 0, STATUS.die2);
	updateshow("point", 0, STATUS.point);
	STATUS.watch("balance", updateshow);
	STATUS.watch("totalbet", updateshow);
	STATUS.watch("die1", updateshow);
	STATUS.watch("die2", updateshow);
	STATUS.watch("point", updateshow);

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

	$("#roll").click(function(){
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
	});

});