$(document).ready(function() {
	$.ajax({
		url: 'http://www.gosugamers.net/dota2/gosubet',
		type: "GET",
		dataType: "html",
		success: function(data)
		{
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

	//set up for popup update
	$("#recentmatches").empty();
	$('body').css('font-size', '10px');
	
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

		appendToTable(url,tournament,team1Name,team1Odds,team2Name,team2Odds);
	}
}
function appendToTable(url,tournament,team1Name,team1Odds,team2Name,team2Odds) {
	var row = "<tr>";
	row += "<td><span class=\"glyphicon glyphicon-eye-open\"></span></td>"; // seen or not seen
	row += "<td>"+team1Name+" ("+team1Odds+") vs "+team2Name+" ("+team2Odds+")</td>";
	row += "<td>"+tournament+"</td>";
	row += "</tr>";
	$('#recentmatches').append(row);
}