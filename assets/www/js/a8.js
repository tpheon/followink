function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(getPosition);
    }
  else{alert("Geolocation is not supported by this browser.");}
  }

function pinit(){
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
}

function getPosition(position)
    {
    alert("Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude); 
    }  

function storeGLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(saveGLocation);
    }
  else{alert("Geolocation is not supported by this browser.");}
  }

function saveGLocation(position){
    var Murloc = Parse.Object.extend("Murloc");
    var loc = new Murloc();
    var coord = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    loc.set("LatLng",coord);
    loc.set("color","000");
    loc.save(null, {
        success: function(loc) {
            alert("Stored position.");
        },
        error: function(loc, error) {
            alert('We may have a problem:' + error.code);
        }
    });
}

function store(color){
    saveLocation();
    var Location = Parse.Object.extend("Location");
    var query = new Parse.Query(Location);
    var number;
    query.first({
    success: function(object) {
        alert('got the color' + object.get('color'));
        object.set('color',color);
        object.save();
        number = object.get('objectId');
        alert('set the color' + object.get('color'));
      },
      error: function(object, error) {
        alert('We may have a problem:' + error.description);
      }
    });
    
}
  
function showLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showMap);
    }
  else{alert("Geolocation is not supported by this browser.");}
  }  

function showError(error)
  {
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
     alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }
}

function draw_map(){
    var c1 = document.getElementById("c1");
    var cont = c1.getContext("2d");
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
    var Location = Parse.Object.extend("Location");
    var query = new Parse.Query(Location);
    var color = "000";
    query.find({ 
      success: function(results) {
          var dx = 10 - results[0].get('latitude');
          var dy = 10 - results[0].get('longitude');
          var lastx = 100;
          var lasty = 100;
          var color = results[0].get('color');
          for (var i=0; i<results.length; i++){
              cont.beginPath();
              cont.moveTo(lastx,lasty);
              lastx = (results[i].get('latitude') + dx)*10;
              lasty = (results[i].get('longitude') + dy)*10;
              cont.lineTo(lastx,lasty);
              color = results[i].get('color');
              cont.strokeStyle = "#" + color;
              cont.stroke();
              cont.closePath()
          }
      },
      error: function(results, error) {
          alert('We may have a problem:' + error.description);
      }
    });
}

function draw(image)
{
    image_set = new Array();
    var p1 = new Image;
    p1.src = "img/pic1.png";
    image_set.push(p1);
    var p2 = new Image;
    p2.src = "img/pic2.png";
    image_set.push(p2);
    var p3 = new Image;
    p3.src = "img/pic3.png";
    image_set.push(p3);
    var c1 = document.getElementById("c1");
    var cont = c1.getContext("2d");
    cont.drawImage(image_set[image-1], 0, 0);
}

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function match_position(e1,e2){
    e1.style.left=getOffset(e2).left + 'px';
    e1.style.top=getOffset(e2).top + 'px';
}

function initialize(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(map_initialize);
    }
    else{alert("Geolocation is not supported by this browser.");}
}

function map_initialize(position) {
    var point1 = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
    var session = [];
    session[0] = point1;
    sessionStorage["session"] = JSON.stringify(session);
    var z = 16;
    if(sessionStorage.zoom != null){
        z = parseInt(sessionStorage.zoom);
    }
    var mapOptions = {
        center: point1,
        zoom: z,
        disableDefaultUI: true,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    google.maps.event.addListener(map, 'zoom_changed', function() {
        draw_on_google_map(map);
      });
    match_position(document.getElementById('mapvas'),document.getElementById('map-canvas'));
    draw_on_google_map(map);
}

function draw_on_google_map(map){
    var numTiles = 1 << map.getZoom();
    var projection = new MercatorProjection();
    var mapvas = document.getElementById("mapvas");
    var cont = mapvas.getContext("2d");
    cont.clearRect(0, 0, mapvas.width, mapvas.height);
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
    var Murloc = Parse.Object.extend("Murloc");
    var query = new Parse.Query(Murloc);
    var color = "000";
    query.find({ 
      success: function(results) {
          var wpoint = projection.fromLatLngToPoint(map.getCenter());
          var lppoint = new google.maps.Point(wpoint.x * numTiles,wpoint.y * numTiles);
          var ppoint = lppoint;
          var lastx = 192;
          var lasty = 128;
          var dx;
          var dy;
          for (var i = 0; i<results.length; i++){
              wpoint = projection.fromLatLngToPoint(results[i].get('LatLng'));
              ppoint = new google.maps.Point(wpoint.x * numTiles,wpoint.y * numTiles);
              cont.beginPath();
              dx = ppoint.x - lppoint.x;
              dy = ppoint.y - lppoint.y;
              cont.moveTo((lastx + dx), (lasty + dy));
              cont.lineTo(lastx,lasty);
              lastx = lastx + dx;
              lasty = lasty + dy;
              lppoint = ppoint;
              color = results[i].get('color');
              cont.strokeStyle = "#" + color;
              cont.stroke();
              cont.closePath();
          }
      },
      error: function(results, error) {
          alert('We may have a problem:' + error.description);
      }
    });
}