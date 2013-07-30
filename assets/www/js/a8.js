function pinit(){
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
}

function storeGLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(saveGLocation);
    }
  else{alert("Geolocation is not supported by this browser.");}
  }


  function storeGLocation2()
    {
        console.log('one');
    if (navigator.geolocation)
      {
      navigator.geolocation.getCurrentPosition(setGLocation);
      }
    else{alert("Geolocation is not supported by this browser.");}
    }
    
function setGLocation(position){
    var session = JSON.parse(sessionStorage.session);
    var running = false;
    console.log(running);
    var time = +new Date();
    console.log(time);
    $("#toggle").on("click", function(){
        console.log("clicked");
        var running = true;
        $("#toggle").off("click");
        $("#toggle").on("click", function(){
            var coord = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
            session.push(coord);
            console.log(session);
        });
    });
    $("#stop").on("click", function(){
        sessionStorage.session = JSON.stringify(session);
        console.log("stopped");
    });
}

function parseGLoc(){
    var GLoc = Parse.Object.extend("GLoc");
    var loc = new GLoc();
    loc.set("JSON_path",sessionStorage.session);
    loc.set("color","000");
    loc.set("user",sessionStorage.user);
    loc.save(null, {
        success: function(loc) {
            alert("Stored position.");
        },
        error: function(loc, error) {
            alert('We may have a problem:' + error.code);
        }
    });
}

function saveGLocation(position){
    console.log(JSON.parse(sessionStorage.session));
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
    session.push(point1);
    sessionStorage.session = JSON.stringify(session);
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
    $(document).ready(function(){
       var w = $('#cont').width();
       w = Math.floor(.8*w);
       $('#map-canvas').width(w);
       $('#mapvas').width(w);
       $('#mapvas').height($('#map-canvas').height());
       $('#mapvas').offset($('#map-canvas').offset());
       console.log($('#mapvas').offset());
       pinit();
       google.maps.event.addListener(map, 'zoom_changed', function() {
           draw_on_google_map(map);
       });
       draw_on_google_map(map);
    }); 
    storeGLocation2();
}

function draw_on_google_map(map){
    var numTiles = 1 << map.getZoom();
    var projection = new MercatorProjection();
    var mapvas = document.getElementById("mapvas");
    var cont = mapvas.getContext("2d");
    cont.clearRect(0, 0, mapvas.width, mapvas.height);
    /*cont.fillStyle="#FF0000";
    cont.fillRect(0, 0, mapvas.width, mapvas.height);*/
    var Murloc = Parse.Object.extend("Murloc");
    var query = new Parse.Query(Murloc);
    var color = "000";
    query.find({ 
      success: function(results) {
          var wpoint = projection.fromLatLngToPoint(map.getCenter());
          var lppoint = new google.maps.Point(wpoint.x * numTiles,wpoint.y * numTiles);
          var ppoint = lppoint;
          var lastx = mapvas.width/2;
          var lasty = mapvas.height/2;
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