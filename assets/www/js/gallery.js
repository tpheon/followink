function load_maps(){
    Parse.initialize("26Otc747ThkgjbDAgkVlFFqSPXfcjtmgWuePVGRA", "x0SDVAE2EYM7Kpg7qmGoSjCqu8ZnBn561GDwtXxN");
    console.log('init');
    var selector = document.getElementById("selector");
    var Test = Parse.Object.extend("Test");
    var query = new Parse.Query(Test);
    var content = "";
    query.find({
        success: function(results) {
            console.log('found' + results.length);
            for (var i = 0; i<results.length; i++){
                content += "<option value=\"" + results[i].get('numb') + "\">" + 
                    results[i].get('info') + "</option>\n";
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
    sessionStorage.user = ($('#user').val());
    document.getElementById("prompt").innerHTML += sessionStorage.user;
}
