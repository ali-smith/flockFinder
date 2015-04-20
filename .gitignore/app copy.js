$(document).ready(function() {
  
	$('.searchButton').on('keyup', function(e) {
		if(e.keyCode==13) {
		console.log($('#locationInputBox').val());
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var locationEntry = $("input[id='locationInputBox']").val();
		getLocation(locationEntry);
		}
	});

	// takes a location to be searched for on FS
	var getLocation = function(locationEntry) {
		
		//the parameters needed to pass in request to FS API
		var resultFS = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?near=" + locationEntry + "&client_id=NECOSTSODFHGDHS4NGAPDBD5TNAMK2DVEC2RQDETACCWGEKH&client_secret=B1X40MSL4I15JZTFAX15YGVRRMAT3EWPYEA3IQQK2D4H41QN&limit=100&v=20150305",
			dataType: "jsonp",
			type: "GET",
			
				success: function(data) {
					window.d = data;
					console.log(data)
					
					//get the total change offset
					var partCheckins = data.response.groups[0].items;
					var concatCheckins = partCheckins.concat(data.response.groups[0].items);
					// console.log (concatCheckins);
					var totalVenues = data.response.totalResults; 

					//sort the results into numberical order by total checkinsCount - default lowest first
					function sortResults (a, b) {
						var pathToCheckins = data.response.groups[0].items.venue.stats.checkinsCount;
						return a.pathToCheckins-b.pathToCheckins;
					}
					
					//reverse the order of sorted results so highest checkinsCount is first
					function reverseResults () {
						concatCheckins.response.groups[0].items.sort(sortResults);
						concatCheckins.response.groups[0].items.reverse();
					}

					//and call html builder	
					function appendResults () {
						$('.resultsUL').append('<li>result goes here</li>');
					}
						
					//if offset less than total
					if (concatCheckins.length < totalVenues) { //this is comparing an array[index] to an integer.  is this a problem?
					//then do this
					getLocation(locationEntry);
					}
				
					// else display final results
					else {	
						sortResults();
						reverseResults();
						appendResults();					
					} 
					
				},
				error: function(data, xhr) {
	                console.log(xhr);
	        	}
		});
	
	};



});//doc ready