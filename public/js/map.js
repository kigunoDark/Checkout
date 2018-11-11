const APP_ID = "uQgXmDHpClihPvIaeCwh";
const APP_CODE = "D6ItEPBOD7ArAPx6Fxa4uA";

let platform = new H.service.Platform({
  app_id: APP_ID,
  app_code: APP_CODE,
  useCIT: true,
  useHTTPS: true
});

const myInit = {
  method: "get"
};

fetch("http://localhost:3000/checkout.json", myInit)
  .then(res => res.json())
  .then(res => {
    console.log(res);
    for (i = 0; i < res["base"].length; i++) {
      console.log(res["base"][i]);
      marker = new H.map.Marker({
        lat: res["base"][i].lat,
        lng: res["base"][i].lng
      });
      marker.label = res["base"][i].evName;
      eventMarkerGroup.addObject(marker);
      eventMarkerDict[marker.label] = [res["base"][i].evInfo, marker];
    }
  });

let defaultLayers = platform.createDefaultLayers();

let map = new H.Map(document.getElementById("map"), defaultLayers.normal.map, {
  zoom: 16,
  center: { lat: 59.92513, lng: 30.24075 }
});

let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

let ui = H.ui.UI.createDefault(map, defaultLayers, "ru-RU");

polygonGroup = new H.map.Group();
eventMarkerGroup = new H.map.Group();
map.addObject(eventMarkerGroup);
map.addObject(polygonGroup);
let eventMarkerDict = {};
var eventCoords = null,
  myCoords = null,
  startCoords = null,
  selectedMarker = null,
  polyline = null;

map.addEventListener("tap", function(evt) {
  console.log(polyline);
  if (polyline == null) {
    $("#deleteRoutBtn").css("display", "none");
    // console.log($("#deleteRoutBtn").css("display"));
  } else {
    $("#deleteRoutBtn").css("display", "inline-block");
  }
  eventCoords = map.screenToGeo(
    evt.currentPointer.viewportX,
    evt.currentPointer.viewportY
  );
  var target = evt.target;
  if (target instanceof mapsjs.map.Marker) {
    reverseGeocode(platform);
    selectedMarker = target.label;
    let eventMarkerWindowTitle = document.querySelector("h1#eventMarkerTitle");
    let eventMarkerWindowDesc = document.querySelector("span#description");
    eventMarkerWindowDesc.innerText = eventMarkerDict[selectedMarker][0];
    eventMarkerWindowTitle.innerText = selectedMarker;
    $("#eventMarkerWindow").modal();
    checkInEvent();
  } else {
    console.log(eventCoords);
    let eventMarkerWindowlng = document.querySelector("input#lng");
    let eventMarkerWindowlat = document.querySelector("input#lat");
    eventMarkerWindowlng.value = eventCoords.lng;
    eventMarkerWindowlat.value = eventCoords.lat;
    $("#eventWindow").modal();
  }
});

function saveBtn() {
  $("#eventWindow").modal("hide");
  marker = new H.map.Marker(eventCoords);
  marker.label = document.getElementById("eventName").value;
  eventMarkerGroup.addObject(marker);
  eventMarkerDict[marker.label] = [
    document.getElementById("eventDesc").value,
    marker
  ];
  document.getElementById("eventForm").reset();
}

function geocode(platform) {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchText: searchVal,
      jsonattributes: 1
    };

  geocoder.search(geocodingParameters, onSuccess, onError);
}

function onSuccess(result) {
  if (result.details != "Empty input String") {
    if (result.response.view[0] != undefined) {
      var locations = result.response.view[0].result;
      addLocationsToMap(locations);
    } else {
      alert("Location not found...");
    }
  }
}

function onError(error) {
  alert("Connection error... Try again later");
}

function addLocationsToMap(locations) {
  var position, i;

  if (locations[0].location != undefined) {
    for (i = 0; i < locations.length; i += 1) {
      position = {
        lat: locations[i].location.displayPosition.latitude,
        lng: locations[i].location.displayPosition.longitude
      };
    }
  } else {
    for (i = 0; i < locations.length; i += 1) {
      position = {
        lat: locations[i].place.locations[0].displayPosition.latitude,
        lng: locations[i].place.locations[0].displayPosition.longitude
      };
    }
  }

  // Add the locations group to the map
  map.setCenter(position);
  map.setZoom(16);
}

function deleteMarkerBtn() {
  if (selectedMarker == undefined) {
    eventMarkerGroup.removeObject(
      eventMarkerDict[document.querySelector("h5#eventMarkerTitle").innerText]
    );
    delete eventMarkerDict[
      document.querySelector("h5#eventMarkerTitle").innerText
    ];
    $("#eventMarkerWindow").modal("hide");
  } else {
    eventMarkerGroup.removeObject(eventMarkerDict[selectedMarker][1]);
    delete eventMarkerDict[selectedMarker];
    $("#eventMarkerWindow").modal("hide");
  }
}

// function getData(ready, url) {
//     var request =  new XMLHttpRequest();
//     request.open('GET', url, true);
//     request.onreadystatechange = function() {
//         if(this.readyState == 4 && this.status != 404){
//             ready(this.responseText);
//         }
//     }
//     request.send();
// };

// let url = 'http://localhost:3000/Kek.json'
// getData(function(jsonData) {
//     jsonText = JSON.parse(jsonData, '');
//     console.log(jsonText);

//     for(key in jsonText) {
//         eventMarkerDict[key] = [jsonText[key][0], new H.map.Marker(jsonText[key][1])];
//         eventMarkerGroup.addObject(eventMarkerDict[key][1]);
//         console.log(eventMarkerDict)
//     }
// }, url);

function myPosition() {
  navigator.geolocation.getCurrentPosition(function(position) {
    startCoords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(startCoords);
    calculateRouteFromAtoB(platform);
  });
}

function toMyPos() {
  navigator.geolocation.getCurrentPosition(function(position) {
    myCoords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(myCoords.lat);
    map.setCenter(myCoords);
    map.setZoom(20);
  });
}

function addPolylineToMap(map) {
  var lineString = new H.geo.LineString();

  lineString.pushPoint({ lat: 59.923979397315065, lng: 30.243786260604963 });
  lineString.pushPoint({ lat: 59.92300081597148, lng: 30.24283139419566 });
  lineString.pushPoint({ lat: 59.92350624070856, lng: 30.241307899475117 });
  lineString.pushPoint({ lat: 59.92398477405591, lng: 30.24014918518077 });
  lineString.pushPoint({ lat: 59.924877300960354, lng: 30.238486215591536 });
  lineString.pushPoint({ lat: 59.925560121599005, lng: 30.24064271163951 });
  lineString.pushPoint({ lat: 59.92522140130636, lng: 30.24096457672121 });
  lineString.pushPoint({ lat: 59.92484504136994, lng: 30.2417263240815261 });
  lineString.pushPoint({ lat: 59.92470524944917, lng: 30.241887256622334 });
  lineString.pushPoint({ lat: 59.924242856592095, lng: 30.243056699752827 });

  polygonGroup.addObject(
    new H.map.Polygon(lineString, {
      style: {
        fillColor: "rgba(0,0,255,0.2)",
        strokeColor: "rgba(0,0,255,0.4)",
        lineWidth: 1
      }
    })
  );
  console.log("awdaw");
}

function routeMe() {
  if (polyline != null) {
    map.removeObject(polyline);
  }
  myPosition();
  $("#eventMarkerWindow").modal("hide");
}

function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: "fastest;car",
      representation: "display",
      routeattributes: "waypoints,summary,shape,legs",
      maneuverattributes: "direction,action",
      waypoint0: "geo!" + startCoords.lat + "," + startCoords.lng, // A
      waypoint1: "geo!" + eventCoords.lat + "," + eventCoords.lng // B
    };

  router.calculateRoute(routeRequestParams, onSuccessRoute, onErrorRoute);
}

function onSuccessRoute(result) {
  var route = result.response.route[0];

  addRouteShapeToMap(route);
}

function onErrorRoute(error) {
  alert("Ooops!");
}

function addRouteShapeToMap(route) {
  var lineString = new H.geo.LineString(),
    routeShape = route.shape;

  routeShape.forEach(function(point) {
    var parts = point.split(",");
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 8,
      strokeColor: "rgba(0, 128, 255, 1)"
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}

function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function reverseGeocode(platform) {
  var geocoder = platform.getGeocodingService(),
    reverseGeocodingParameters = {
      prox: "" + eventCoords.lat + "," + eventCoords.lng + ",150",
      mode: "retrieveAddresses",
      maxresults: "1",
      jsonattributes: 1
    };

  geocoder.reverseGeocode(
    reverseGeocodingParameters,
    onReverseSuccess,
    onReverseError
  );
}

function onReverseSuccess(result) {
  let eventMarkerWindowAdress = document.querySelector("label#modal_address");
  eventMarkerWindowAdress.innerText =
    result.response.view[0].result[0].location.address.label;
}

function onReverseError(error) {
  alert("Ooops!");
}

var searchVal = null;
function enterSearch() {
  searchVal = document.getElementById("SearchTextHeader").value;
  geocode(platform);
}

function deleteRout() {
  map.removeObject(polyline);
  $("#eventMarkerWindow").modal("hide");
}

function latlng2distance(lat1, long1, lat2, long2) {
  //радиус Земли
  var R = 6372795;
  //перевод коордитат в радианы
  lat1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  long1 *= Math.PI / 180;
  long2 *= Math.PI / 180;
  //вычисление косинусов и синусов широт и разницы долгот
  var cl1 = Math.cos(lat1);
  var cl2 = Math.cos(lat2);
  var sl1 = Math.sin(lat1);
  var sl2 = Math.sin(lat2);
  var delta = long2 - long1;
  var cdelta = Math.cos(delta);
  var sdelta = Math.sin(delta);
  //вычисления длины большого круга
  var y = Math.sqrt(
    Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2)
  );
  var x = sl1 * sl2 + cl1 * cl2 * cdelta;
  var ad = Math.atan2(y, x);
  var dist = ad * R; //расстояние между двумя координатами в метрах
  return dist;
}

function checkInEvent() {
  let flg = false;
  navigator.geolocation.getCurrentPosition(function(position) {
    for (key in eventMarkerDict) {
      let cooords = eventMarkerDict[key][1].getPosition();
      let distance = latlng2distance(
        cooords.lat,
        cooords.lng,
        position.coords.latitude,
        position.coords.longitude
      );
      if (distance < 100) {
        flg = true;
      }
      let valutaLabel = document.querySelector("label#valuta");
      valutaLabel.innerText = 1000;
    }
  });
}

addPolylineToMap();
