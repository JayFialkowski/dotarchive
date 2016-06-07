console.log("testing");
$(document).ready(function() {
	console.log("ready");
	$.ajax({
		url: 'http://www.gosugamers.net/dota2/gosubet',
		type: "GET",
		dataType: "html",
		success: function(data)
		{
			console.log('success');
			parseHTML(data);
		},
	});
});
function parseHTML(data) {
	// strip newlines and tabs because those are annoying
	data = data.replace(/(\r\n|\n|\r)/gm,"");
	
	// recentMatchesBlock is the contents of the <tbody>, containing recent matches.
	// this will make it easier to strip individual data
	var recentMatchesBlockPattern = /Dota 2 Recent Results .+? <tbody>(.+?)<\/tbody>/i;
	var recentMatchesBlock = recentMatchesBlockPattern.exec(data)[1];

	// iterate through each <tr>, which contains one match
	var ptrn = /<tr>(.+?)<\/tr>/ig;
	var match;

	while ((match = ptrn.exec(recentMatchesBlock)) != null )
	{
		var raw = match[1];
		
		var urlPattern = /<a href=\"(.+?)\"/i;
		var tournamentPattern = /<a .+?span&gt;(.+?)\&/i;
		var team1NamePattern = /<span class=\"opp opp1\">.+?<span>(.+?)<\/span>/i;
		var team2NamePattern = /<span class=\"opp opp2\">.+?<span>(.+?)<\/span>/i;
		var team1FlagPattern = /<span.+?opp1.+?<span title=.+?class="(.+?)"/i;
		var team2FlagPattern = /<span.+?opp2.+?<span title=.+?class="(.+?)"/i;
		var team1OddsPattern = /<span class=".+?bet1">\((.+?)\)<\/span>/i;
		var team2OddsPattern = /<span class=".+?bet2">\((.+?)\)<\/span>/i;

		var url = urlPattern.exec(raw)[1];
		var tournament = tournamentPattern.exec(raw)[1];
		var team1Name = team1NamePattern.exec(raw)[1];
		var team2Name = team2NamePattern.exec(raw)[1];
		var team1Flag = team1FlagPattern.exec(raw)[1];
		var team2Flag = team2FlagPattern.exec(raw)[1];
		var team1Odds = team1OddsPattern.exec(raw)[1];
		var team2Odds = team2OddsPattern.exec(raw)[1];

		// console.log(tournament);
		// console.log(url);
		// console.log(team1Name + "|" + team1Flag + "|" + team1Odds);
		// console.log(team2Name + "|" + team2Flag + "|" + team2Odds);
		// console.log("\n\n\n");
		appendToTable(url,tournament);
	}
}
function appendToTable(url,tournament) {
	$("#recentmatches").empty();
	console.log(url+"|"+tournament);
}