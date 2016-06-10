$(document).ready(function() {
	$.ajax({
		url: 'http://www.gosugamers.net/dota2/vods',
		type: "GET",
		dataType: "html",
		success: function(data) 
		// enter ajax success callback function
		{
			$("#hometab").blur(); // remove focus
			chrome.storage.sync.get(null,function(items) {
				var hiddenMatches;
				if (items['matches']) hiddenMatches = items['matches'];
				else hiddenMatches = [];

				parseHTML(data,hiddenMatches);
				propagateSettings(hiddenMatches);

				$(".clickable-cell").click(function() {
					window.open(($(this).parent().attr("data-href")), '_blank');
					hideMatch($(this).parent().attr("data-href"));
				});
				$(".glyphicon-eye-open").click(function() {
					hideMatch($(this).parent().parent().attr("data-href"));
					$(this).parent().parent().hide();
				});
				$("#clearhidden").click(function() {
					chrome.storage.sync.clear();
				});
				$(".unhide").click(function() {
					$(this).parent().remove();
					unhideMatch($(this).siblings('span').text());
				});
			});
		}
	});
});
/*
 * TODO: this method should display all matches from hiddenmatches *AFTER* it has been updated
*/
function propagateSettings(hiddenMatches) {
	console.log(hiddenMatches);
	for (var i=0;i<hiddenMatches.length;i++) {
		var row = "";
		row += "<li class='list-group-item'>";
		row += "<button type='button' class='btn btn-default unhide'><span class='glyphicon glyphicon-share'></span></button>";
		row += "<span>"+hiddenMatches[i].replace("http://www.gosugamers.net/dota2/tournaments","...")+"</span>";
		row += "</li>";
		$("#hiddenmatches").append(row);
	}
}
/*
 * TODO: this method should update hiddenmatches and hide the appropriate items
*/
function hideMatch(matchURL) {
	chrome.storage.sync.get(null,function(items) {
		var matches;
		if (items['matches']) {
			matches = items['matches'];
			matches.push(matchURL);
			if (matches.length > 50)
				matches.shift();
		} else {
			matches = [matchURL];
		}
		chrome.storage.sync.set({"matches":matches});
	});
}
/*
 * TODO: this method should update hiddenmatches and unhide the appropriate items
*/
function unhideMatch(matchURL) {
	matchURL = matchURL.replace("...","http://www.gosugamers.net/dota2/tournaments");
	chrome.storage.sync.get(null,function(items) {
		var hiddenMatches;
		if (items['matches']) hiddenMatches = items['matches'];
		else hiddenMatches = [];
		hiddenMatches.splice(hiddenMatches.indexOf(matchURL),1);
		console.log(hiddenMatches);
	});
}
/*
 * TODO: this should display **all matches** and depend on the appropriate ones to be hidden
*/
function parseHTML(data,hiddenMatches) {
	// strip newlines and tabs because those are annoying
	data = data.replace(/(\r\n|\n|\r)/gm,"");

	var tablePattern = /<h1>Dota 2 VODs<\/h1>.+?<tbody>(.+?)<\/tbody>/i;
	var tableBlock = tablePattern.exec(data);

	var pattern = /<tr>(.+?)<\/tr>/ig;
	var match;
	
	while ((match=pattern.exec(tableBlock[1]))!=null) {
		var raw = match[1];
		var urlPattern = /<a href=\"(.+?)\"/i;
		var tournamentPattern = /<a .+?span&gt;(.+?)( \(.+?\))?\&/i;
		var addedPattern = /<td><span class=.added.>(.+?)<\/span>/i;
		var team1NamePattern = /<span class=\"opp opp1\">.+?<span>(.+?)<\/span>/i;
		var team2NamePattern = /<span class=\"opp opp2\">.+?<span>(.+?)<\/span>/i;
		var team1FlagPattern = /<span.+?opp1.+?<span title=.+?class="flag (.+?)"/i;
		var team2FlagPattern = /<span.+?opp2.+?<span title=.+?class="flag (.+?)"/i;

		var url = "http://www.gosugamers.net"+urlPattern.exec(raw)[1];
		var tournament = tournamentPattern.exec(raw)[1];
		var added = addedPattern.exec(raw)[1];
		var team1Name = team1NamePattern.exec(raw)[1].replace("Dota 2","");
		var team2Name = team2NamePattern.exec(raw)[1].replace("Dota 2","");
		var team1Flag = team1FlagPattern.exec(raw)[1];
		var team2Flag = team2FlagPattern.exec(raw)[1];
		appendToTable(url,tournament,added,team1Name,team1Flag,team2Name,team2Flag);
	}
	syncHiddenMatches();
}
function appendToTable(url,tournament,added,team1Name,team1Flag,team2Name,team2Flag) {
	//data-href='url://'
	var row = "<tr data-href='"+url+"'>";
	row += "<td><br><span class='glyphicon glyphicon-eye-open'></span></td>"; // seen or not seen
	row += "<td class='clickable-cell text-center'><img class='flag' src='./assets/flags/"+team1Flag+".png'/>"+team1Name+"<br>vs<br><img class='flag' src='./assets/flags/"+team2Flag+".png'/>"+team2Name+"</td>";
	row += "<td class='clickable-cell'>"+tournament+"<br><br>"+added+"</td>";
	row += "</tr>";
	$('tbody').append(row);
}

/*
 * TODO: This method should grab all of hiddenmatches. If any match is not found on the match list (hidden or not) remove it from array
*/
function syncHiddenMatches() {

}
