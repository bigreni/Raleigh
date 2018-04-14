    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', loadFavorites, false);
        } else {
            loadFavorites();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/3419625019'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/7516860115'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }

    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }

    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById("screen").style.display = 'none';
        });
        document.addEventListener('onAdLoaded', function (data) { });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { });
        document.addEventListener('onAdDismiss', function (data) {
            document.getElementById("screen").style.display = 'none';
        });
    }

    function loadInterstitial() {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: true });
    }

function loadFavorites()
{
    initApp();
    //document.getElementById("screen").style.display = 'none';
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

 
