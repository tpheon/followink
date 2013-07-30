function load_maps(){
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
    console.log('init');
    var selector = document.getElementById("selector");
    var GLoc = Parse.Object.extend("GLoc");
    var query = new Parse.Query(GLoc);
    var content = "";
    query.find({
        success: function(results) {
            console.log('found' + results.length);
            for (var i = 0; i<results.length; i++){
                content += "<option value=\"" + results[i].createdAt + "\">" + 
                    results[i].createdAt + "</option>\n";
            }
            console.log(content);
            selector.innerHTML = content;
			$("#sbox").hide().show();
        },
        error: function(results, error) {
            alert('We may have a problem:' + error.description);
        }
        });
}

function show(){
    console.log($('#selector').val() + " " + sessionStorage.user);
}

function set_user(){
    sessionStorage.user = ($('#user').val()).toLowerCase();
    sessionStorage.zoom = ($('#ranger').val());
    console.log(sessionStorage.zoom);
    document.getElementById("prompt").innerHTML += sessionStorage.user;
}
