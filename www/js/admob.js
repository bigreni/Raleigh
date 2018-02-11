    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            checkFirstUse();
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
            document.getElementById("screen").style.display = 'none';        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: true });
    }

   function checkFirstUse()
    {
        $('#simplemenu').sidr();
        $("span").remove();
        $(".dropList").select2();
        window.ga.startTrackerWithId('UA-88579601-8', 1, function(msg) {
            window.ga.trackView('Home');
        });    
        initApp();
        askRating();
        //document.getElementById('screen').style.display = 'none';     
    }

function askRating()
{
  AppRate.preferences = {
  openStoreInApp: true,
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1347658051',
                android: 'market://details?id=com.raleigh.free'
               }
};
 
AppRate.promptForRating(false);
}


function loadFaves()
{
    window.location = "Favorites.html";
    window.ga.trackView('Favorites');
}

function loadRoutes() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#routeStopSelect").attr("disabled", "");
    $("#routeStopSelect").val('0');
    $("#message").text('');
    var agencyId = $("#agencySelect").val();
    $.ajax(
          {
              type: "GET",
              url: "https://transloc-api-1-2.p.mashape.com/routes.json",
              data: "agencies=" + agencyId,
              headers: { "X-Mashape-Key":"vBwd7z6qCBmshdjgjUkwzPgi0Fwxp14ZqVXjsnWpBxFFvGTLn4" },
              contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }
                  var list = $("#routeSelect");
                  $(list).empty();
                  $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
                  var numDirections = msg.data[agencyId];
                  if (numDirections.length == null) {
                      $(list).append($("<option />").val(numDirections.route_id).text(numDirections.short_name + " - " + numDirections.long_name));
                  }
                  else {
                      $.each(numDirections, function (index, item) {
                          $(list).append($("<option />").val(item.route_id).text(item.short_name + " - " + item.long_name));
                      });
                  }
                  $(list).removeAttr('disabled');
                  $(list).val('0');
              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
    }

function loadStops() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');
    var agencyId = $("#agencySelect").val();
    var routeId = $("#routeSelect").val();
    $.ajax(
          {
              type: "GET",
              url: "https://transloc-api-1-2.p.mashape.com/stops.json",
              data: "agencies=" + agencyId,
              headers: { "X-Mashape-Key": "vBwd7z6qCBmshdjgjUkwzPgi0Fwxp14ZqVXjsnWpBxFFvGTLn4" },
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }
                  var stopList = $("#routeStopSelect");
                  $(stopList).empty();
                  $(stopList).append($("<option disabled/>").val("0").text("- Select Stop -"));
                  var numStops = msg.data;
                  $.each(numStops, function (index, item) {
                      for (var x in item.routes) {
                          if(item.routes[x] == routeId){
                              $(stopList).append($("<option />").val(item.stop_id).text(item.name + " (#" + item.code + ")"));
                          }
                      }
                  });
                  $(stopList).removeAttr('disabled');
                  $(stopList).val('0');

              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
}

function loadArrivals() {
    window.ga.trackView($("#agencySelect option:selected").text());
    var outputContainer = $('.js-next-bus-results');
    var results = "";
    var agencyId = $("#agencySelect").val();
    var routeId = $("#routeSelect").val();
    var stopId = $("#routeStopSelect").val();
    $.ajax(
          {
              type: "GET",
              url: "https://transloc-api-1-2.p.mashape.com/arrival-estimates.json",
              data: "agencies=" + agencyId + "&routes=" + routeId + "&stops=" + stopId,
              headers: { "X-Mashape-Key": "vBwd7z6qCBmshdjgjUkwzPgi0Fwxp14ZqVXjsnWpBxFFvGTLn4" },
              contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                      document.getElementById('btnSave').style.visibility = "hidden";
                  }

                  else {
                      if(output.data.length == 0){
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      else
                      {
                      var arrivals = output.data[0].arrivals[0];
                      results = results.concat("<p><strong>" + $("#routeSelect option:selected").text() + " - " + $("#routeStopSelect option:selected").text() + "</strong></p>");
                      var arrivalTime = Date.parse(arrivals.arrival_at) - Date.now();
                      arrivalTime = Math.round(((arrivalTime % 86400000) % 3600000) / 60000);
                      results = results.concat("<p>" + arrivalTime + " min(s)</p>");
                      }
                      
                      if (results == "") {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      $(outputContainer).html(results).show();
                      document.getElementById('btnSave').style.visibility = "visible";
                  }
              }
          });
}