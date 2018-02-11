function loadFavorites()
{
    $('#simplemenu').sidr();
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split(":");
        arrIds = arrStops[0].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right;">&#x2718;</button><a href="javascript:loadArrival(' + arrIds[0] + ',' + arrIds[1] +',' + arrIds[2] + ",'" + arrStops[1].trim() + "'"  +')"; class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var newFave = $('#agencySelect option:selected').val() + ">" + $("#routeSelect option:selected").val() + ">" + $("#routeStopSelect option:selected").val() + ":" + $('#agencySelect option:selected').text() + " > " + $("#routeSelect option:selected").text() + " > " + $("#routeStopSelect option:selected").text();
        if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            $("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        $("#message").text('Stop added to favorites!!');
}

function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadArrival(agencyId,routeId,stopId,text)
{
    var outputContainer = $('.js-next-bus-results');
    var results = "";
    $.ajax({
        type: "GET",
        url: "https://transloc-api-1-2.p.mashape.com/arrival-estimates.json",
        data: "agencies=" + agencyId + "&routes=" + routeId + "&stops=" + stopId,
        headers: { "X-Mashape-Key": "vBwd7z6qCBmshdjgjUkwzPgi0Fwxp14ZqVXjsnWpBxFFvGTLn4" },
        contentType: "application/json;	charset=utf-8",
        dataType: "json",
        success: function (output) {
            if (output == null) {
                output = { errorMessage: "Sorry, an	internal error has occurred." };
            }
            if(output.data.length == 0){
                results = results.concat("<p> No upcoming arrivals.</p>");
            }
            else
            {
                var arrivals = output.data[0].arrivals;
                for (var x in output.data[0].arrivals)
                    {
                        var arrivalTime = Date.parse(arrivals[x].arrival_at) - Date.now();
                        arrivalTime = Math.round(((arrivalTime % 86400000) % 3600000) / 60000);
                        if(arrivalTime >= 0)
                            results = results.concat("<p>" + arrivalTime + " min</p>");                       
                    }
            }
                      
            if (results == "") {
                results = results.concat("<p> No upcoming arrivals.</p>");
            }
            results = "<p><strong>" + text + "</strong></p>" + results;
            $(outputContainer).html(results).show();
        }
    });
}

 
