function pinit(){
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
}

function map_point(latLng, color, weight){
    this.latLng = latLng;
    this.color = color;
    this.weight = weight;
}

function storeGLocation2()
{
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(setGLocation);
    }
    else{alert("Geolocation is not supported by this browser.");}
}
    
function setGLocation(position){
    var session = JSON.parse(sessionStorage.session);
    var coord = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
    var w = parseInt($('#strokesize').val());
    var c = $("#hex").val();
    if(c == null){
        c = "000";
    }
    console.log(c);
    session.push(new map_point(coord,c,w));
    sessionStorage.session = JSON.stringify(session);
}

function parseGLoc(){
    var GLoc = Parse.Object.extend("GLoc");
    var loc = new GLoc();
    console.log("something");
    loc.set("JSON_path",sessionStorage.session);
    if(sessionStorage.user != null){
        loc.set("user",sessionStorage.user);
    }else{loc.set("user","Isaac")}
    loc.set("title",$("#file").val());
    loc.save(null, {
        success: function(loc) {
            alert("Stored position.");
        },
        error: function(loc, error) {
            alert('We may have a problem:' + error.code);
        }
    });
}

function initialize(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(draw_initialize);
    }
    else{alert("Geolocation is not supported by this browser.");}
}

function draw_initialize(position) {
    var point1 = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
    var session = [];
    var d = new Date();
    $('#colorpickerholder').ColorPickerSetColor("#000000");
    $('#strokesize').val(1);
    $('#file').val(d.toLocaleDateString() + ", " + d.toLocaleTimeString());
    session.push(new map_point(point1,"000",1));
    sessionStorage.session = JSON.stringify(session);
    map_initialize(session, true);
}

function map_initialize(set, drawing){
    var point1 = new google.maps.LatLng(set[0].latLng.jb,
        set[0].latLng.kb);
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
        var h = $('#cont').height();
        $('#map-canvas').width(w);
        $('#map-canvas').height(h);
        console.log(h + " " +w);
        var cstr = "<canvas id=\"mapvas\" width=\""+w+"\" height=\""+h+
            "\"class=\"overmap\"></canvas>";
            document.getElementById("canv").innerHTML = cstr;
        $('#mapvas').width(w);
        $('#mapvas').height(h);
        $('#mapvas').offset($('#map-canvas').offset());
        pinit();
    });
    if(drawing){
        $("#stop").off("click");
        $("#stop").on("click", function(){
            parseGLoc();
        });
        $("#toggle").off("click");
        $("#toggle").on("click", function(){
            storeGLocation2();
            draw2(map,JSON.parse(sessionStorage.session));
        });
    }
    else{
        draw2(map,set);
    }
}

function g_init(){
    pinit();
    var GLoc = Parse.Object.extend("GLoc");
    var query = new Parse.Query(GLoc);
    var set;
    query.equalTo('title',sessionStorage.map);
    query.find({
        success: function(results) {
            set = JSON.parse(results[0].get("JSON_path"));
            map_initialize(set,false);
        },
        error: function(results, error) {
            alert('We may have a problem:' + error.description);
        }
        });  
}

function draw2(map,set){
    var numTiles = 1 << map.getZoom();
    var projection = new MercatorProjection();
    var mapvas = document.getElementById("mapvas");
    var cont = mapvas.getContext("2d");
    cont.clearRect(0, 0, mapvas.width, mapvas.height);
    var color = "000";
    var wpoint = projection.fromLatLngToPoint(map.getCenter());
    var lppoint = new google.maps.Point(wpoint.x * numTiles,wpoint.y * numTiles);
    var ppoint = lppoint;
    var lastx = mapvas.width/2;
    var lasty = mapvas.height/2;
    var dx;
    var dy;
    for (var i = 0; i<set.length; i++){
        wpoint = projection.fromLatLngToPoint(set[i].latLng);
        ppoint = new google.maps.Point(wpoint.x * numTiles,wpoint.y * numTiles);
        color=set[i].color;
        cont.beginPath();
        cont.lineWidth=set[i].weight;
        dx = ppoint.x - lppoint.x;
        dy = ppoint.y - lppoint.y;
        cont.moveTo((lastx + dx), (lasty + dy));
        cont.lineTo(lastx,lasty);
        lastx = lastx + dx;
        lasty = lasty + dy;
        lppoint = ppoint;
        cont.strokeStyle = "#" + color;
        cont.stroke();
        cont.closePath();
    }
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

function colorpickerStart(){
		$('#colorpickerholder').ColorPicker({flat: true});
}