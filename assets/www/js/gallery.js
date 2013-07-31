function load_maps(){
    pinit();
    console.log('init');
    $('#tog').on('click',function(){
        set_user();
        document.getElementById("prompt").innerHTML = "Hello " + sessionStorage.user;
        var selector = document.getElementById("selector");
        var GLoc = Parse.Object.extend("GLoc");
        var query = new Parse.Query(GLoc);
        var content = "";
        console.log(sessionStorage.user);
        query.equalTo('user',sessionStorage.user);
        query.find({
            success: function(results) {
                console.log('found' + results.length);
                for (var i = 0; i<results.length; i++){
                    content += "<option value=\"" + results[i].get("title") + "\">" + 
                        results[i].get("title") + "</option>\n";
                }
                selector.innerHTML = content;
    			$("#sbox").hide().show();
    			$("#selector").change(function(){
    			    sessionStorage.map = $("#selector").val();
    			    console.log(sessionStorage.map);
    			});
            },
            error: function(results, error) {
                alert('We may have a problem:' + error.description);
            }
            });
    });
}

function show(){
    console.log($('#selector').val() + " " + sessionStorage.user);
}

function set_user(){
    sessionStorage.user = ($('#user').val());
    sessionStorage.zoom = ($('#ranger').val());
}