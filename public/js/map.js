const APP_ID = "uQgXmDHpClihPvIaeCwh";
const APP_CODE = "D6ItEPBOD7ArAPx6Fxa4uA";

let platform = new H.service.Platform({
    'app_id': APP_ID,
    'app_code': APP_CODE,
    useCIT: true,
    useHTTPS: true
});

let defaultLayers = platform.createDefaultLayers();

let map = new H.Map(
    document.getElementById('map'),
    defaultLayers.normal.map,
    {
        zoom: 16,
        center: { lat: 59.92513, lng: 30.24075 }
});

let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

let ui = H.ui.UI.createDefault(map, defaultLayers, "ru-RU");

eventMarkerGroup = new H.map.Group();
map.addObject(eventMarkerGroup);
let eventMarkerDict = {};
var eventCoords = null, startCoords = null, selectedMarker = null, polyline = null;

map.addEventListener('tap', function(evt) {
    eventCoords =  map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    var target = evt.target;
    if (target instanceof mapsjs.map.Marker) {
      reverseGeocode(platform);
      selectedMarker = target.label;
      let eventMarkerWindowTitle = document.querySelector('h5#eventMarkerTitle');
      let eventMarkerWindowDesc = document.querySelector('span#description');
      eventMarkerWindowDesc.innerText = eventMarkerDict[selectedMarker][0];
      eventMarkerWindowTitle.innerText = selectedMarker;
      $('#eventMarkerWindow').modal();
    } else {
        $('#eventWindow').modal();
    }
});

function saveBtn() {
    $('#eventWindow').modal('hide');
    marker = new H.map.Marker(eventCoords);
    marker.label = document.getElementById("eventName").value;
    eventMarkerGroup.addObject(marker);
    eventMarkerDict[marker.label] = [document.getElementById("eventDesc").value, marker];
    document.getElementById('eventForm').reset();
}

function geocode(platform) {
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: searchVal,
            jsonattributes : 1
        };

    geocoder.search(
        geocodingParameters,
        onSuccess,
        onError
    );
}

function onSuccess(result) {
    if (result.details != 'Empty input String') {
      if (result.response.view[0] != undefined) {
        var locations = result.response.view[0].result;
        addLocationsToMap(locations);
      } else {
          alert('Location not found...')
      }
    }
}

function onError(error) {
    alert('Connection error... Try again later');
}

function addLocationsToMap(locations){
    var position,
        i;

    if (locations[0].location != undefined) {
        for (i = 0;  i < locations.length; i += 1) {
            position = {
                lat: locations[i].location.displayPosition.latitude,
                lng: locations[i].location.displayPosition.longitude
            };
            
        }
    } else {
        for (i = 0;  i < locations.length; i += 1) {
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
        eventMarkerGroup.removeObject(eventMarkerDict[document.querySelector('h5#eventMarkerTitle').innerText]);
        delete eventMarkerDict[document.querySelector('h5#eventMarkerTitle').innerText];
        $('#eventMarkerWindow').modal('hide');
    } else {
        eventMarkerGroup.removeObject(eventMarkerDict[selectedMarker][1]);
        delete eventMarkerDict[selectedMarker];
        $('#eventMarkerWindow').modal('hide');
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
  navigator.geolocation.getCurrentPosition(
    function(position) {
        startCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        calculateRouteFromAtoB(platform);
    }
  );
}

function routeMe() {
  if (polyline != null) {
    map.removeObject(polyline);
    //TODO: ПОЯВЛЯЕТСЯ КНОПКА УДАЛИТЬ МАРШРУТ
  }
  myPosition();
  $('#eventMarkerWindow').modal('hide');
}

function calculateRouteFromAtoB (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes : 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: 'geo!' + startCoords.lat + ',' + startCoords.lng, // A
      waypoint1: 'geo!' + eventCoords.lat + ',' + eventCoords.lng  // B
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccessRoute,
    onErrorRoute
  );
}

function onSuccessRoute(result) {
  var route = result.response.route[0];

  addRouteShapeToMap(route);
}

function onErrorRoute(error) {
  alert('Ooops!');
}

function addRouteShapeToMap(route){
  var lineString = new H.geo.LineString(),
    routeShape = route.shape;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 8,
      strokeColor: 'rgba(0, 128, 255, 1)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
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
      prox: '' + eventCoords.lat + ',' + eventCoords.lng + ',150',
      mode: 'retrieveAddresses',
      maxresults: '1',
      jsonattributes : 1
    };

  geocoder.reverseGeocode(
    reverseGeocodingParameters,
    onReverseSuccess,
    onReverseError
  );
}

function onReverseSuccess(result) {
  let eventMarkerWindowAdress = document.querySelector('label#modal_address');
  eventMarkerWindowAdress.innerText = result.response.view[0].result[0].location.address.label;
}

function onReverseError(error) {
  alert('Ooops!');
}

var searchVal = null;
function enterSearch() {
  searchVal = document.getElementById("SearchTextHeader").value;
  geocode(platform);
}

function deleteRout() {
  map.removeObject(polyline);
  $('#eventMarkerWindow').modal('hide');
}