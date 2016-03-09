//alert("hi, this alert is coming from the js file in public/javascripts");
var femaleKeywords = [[]];
var maleKeywords = [[]];
//keywords[formality-1][intimacy-1]
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "javascripts/female.csv",
        dataType: "text",
        success: function(data) {
        	femaleKeywords = CSVToArray(data);

        }
     });
});

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "javascripts/male.csv",
        dataType: "text",
        success: function(data) {
        	maleKeywords = CSVToArray(data);

        }
     });
});


function knowledge(){
	var age = $("#myAge").val();
	var mySex= $("#mySex").val();
	var giftAge= $("#giftAge").val();
	var giftSex= $("#giftSex").val();
	var rel= $("#rel").val();
	var occ= $("#occ").val();

	var intimacy = parseInt(rel);
	var formality = parseInt(occ);
	var gender = giftSex;
	var minPrice;
	var maxPrice;
	if(age < 20){
		minPrice = 10;
		maxPrce = 40;
	}
	else if(age >= 20){
		minPrice = 50;
		maxPrice = 100;
	}

	if(formality > 3 || intimacy > 3){
		minPrice *= 2;
		maxPrice *= 2;
	}

	if(formality==1 || intimacy == 1){
		minPrice /= 2;
		maxPrice /= 2;
	}

	var kword = "gift";

	if(gender == "female"){
		kword = femaleKeywords[formality-1][intimacy-1];
	}

	if(gender == "male"){
		kword = maleKeywords[formality-1][intimacy-1];
	}

	var data = {"kword": kword, "minPrice": minPrice, "maxPrice": maxPrice};

	$.ajax({
	  type: "POST",
	  url: "/gift",
	  data: JSON.stringify(data),
	  contentType: 'application/json',
	  success: function(res){
	  	//alert(res);
	  	window.location.href = res;
	  },
	});
}

$('#myForm').on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation(); // only neccessary if something above is listening to the (default-)event too
});



function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );

    var arrData = [[]];
    var arrMatches = null;

    while (arrMatches = objPattern.exec( strData )){

        var strMatchedDelimiter = arrMatches[ 1 ];

        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            arrData.push( [] );

        }

        var strMatchedValue;

        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            strMatchedValue = arrMatches[ 3 ];

        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

