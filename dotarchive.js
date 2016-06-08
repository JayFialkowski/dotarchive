$(document).ready(function() {
	$.ajax({
		url: 'http://www.gosugamers.net/dota2/vods',
		type: "GET",
		dataType: "html",
		success: function(data) 
		// enter ajax success callback function
		{
			chrome.storage.sync.get(null,function(items) {
				var hiddenMatches;
				if (items['matches']) hiddenMatches = items['matches'];
				else hiddenMatches = [];
				parseHTML(data,hiddenMatches);
				$(".clickable-cell").click(function() {
					//window.open(($(this).parent().attr("data-href")), '_blank');
					updateHiddenMatches($(this).parent().attr("data-href"));
				});
				$(".glyphicon-eye-open").click(function() {
					console.log("hide this row");
				});
				$("#clearhidden").click(function() {
					chrome.storage.sync.clear();
				});
			});
		}
	});
});

function updateHiddenMatches(matchURL) {
	chrome.storage.sync.get(null,function(items) {
		var matches;
		if (items['matches']) {
			matches = items['matches'];
			matches.push(matchURL);
			if (matches.length > 30)
				matches.shift();
		} else {
			matches = [matchURL];
		}
		console.log("hiding "+matchURL);
		chrome.storage.sync.set({"matches":matches});
	});
}

function parseHTML(data,hiddenMatches) {

	console.log(hiddenMatches);

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
		var team1FlagPattern = /<span.+?opp1.+?<span title=.+?class="(.+?)"/i;
		var team2FlagPattern = /<span.+?opp2.+?<span title=.+?class="(.+?)"/i;

		var url = "http://www.gosugamers.net"+urlPattern.exec(raw)[1];
		var tournament = tournamentPattern.exec(raw)[1];
		var added = addedPattern.exec(raw)[1];
		var team1Name = team1NamePattern.exec(raw)[1];
		var team2Name = team2NamePattern.exec(raw)[1];
		var team1Flag = team1FlagPattern.exec(raw)[1];
		var team2Flag = team2FlagPattern.exec(raw)[1];
		if (hiddenMatches.indexOf(url) < 0) appendToTable(url,tournament,added,team1Name,team2Name);
	}
}
function appendToTable(url,tournament,added,team1Name,team2Name) {
	//data-href='url://'
	var row = "<tr data-href='"+url+"'>";
	//row += "<td><span class='glyphicon glyphicon-eye-open'></span></td>"; // seen or not seen
	row += "<td class='clickable-cell'><h6><strong>"+team1Name+"</strong> vs <strong>"+team2Name+"</strong></h6></td>";
	row += "<td class='clickable-cell'><h6><strong>"+tournament+"</strong></h6></td>";
	row += "<td class='clickable-cell'><h6><strong>"+added+"</strong></h6></td>";
	row += "</tr>";
	$('tbody').append(row);
}
