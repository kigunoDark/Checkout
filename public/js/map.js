var platform = new H.service.Platform({
  app_id: "yaN9kMcXHi7DSWnynj5a",
  app_code: "n5BKBYZhGz3vgYBRYbiAPQ"
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById("map"), defaultLayers.normal.map);

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

$("#SearchInHeader").animate(
  {
    opacity: "1"
  },
  1000
);
