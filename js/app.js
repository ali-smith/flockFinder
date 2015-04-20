
$(document).ready(function() {
  
	$("input[id='locationInputBox']").on('keyup', function(e) {
		if(e.keyCode==13) {
		
			// get the value of the tags the user submitted
			var locationEntry = $.trim($(this).val());
			
			getLocation(locationEntry);

			if (locationEntry.length > 0){
				$(this).val('').blur();
				$('body').removeClass('flamingosBackground');
				$('.searchWrapper').addClass('backgroundWhite');
				$('#searchErrorWrapper').fadeOut(500);
				$('.venuesWrapper').html('');
				$('#blue').fadeIn(1000);
				$('.searchParagraph').fadeIn(3000);
				$('#flyingFlamingoID').toggleClass('flamingoFly');

			}
			
			else {

			//do nothing
			
			}//else 

		}//keycode
			
	});

	
	function changeBirds() {
						if ($('#flyingFlamingoID').hasClass('flamingoFly')) {
							$('#flyingFlamingoID').attr('src', 'images/dreamstime_m_48370537_155x157R.png');
						}else{
							$('#flyingFlamingoID').attr('src', 'images/dreamstime_m_48370537_155x157L.png');
						}
					}
	// takes a location to be searched for on FS
	var getLocation = function(locationEntry) {
		
		//the parameters needed to pass in request to FS API
		var resultFS = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?near=" + locationEntry + "&client_id=NECOSTSODFHGDHS4NGAPDBD5TNAMK2DVEC2RQDETACCWGEKH&client_secret=B1X40MSL4I15JZTFAX15YGVRRMAT3EWPYEA3IQQK2D4H41QN&limit=50&v=20150305",
			dataType: "jsonp",
			type: "GET",
			
				success: function(data) {
					// window.d = data;
					console.log(data);

					if (data.meta.errorType === 'failed_geocode' || data.meta.errorType === 'geocode_too_big'){
						$('#searchErrorP').html('sorry ... no flocks found in "' + locationEntry + '."');
						setTimeout(function(){
							changeBirds();
							$('#locationInputBox').focus();
							$('#blue').fadeOut(1000);
							$('.searchParagraph').fadeOut(100);
							$('#searchErrorWrapper').fadeIn();
						}, 4000);
					}
					
					else{
					

					//sort the data by total checkinsCount (default is lowest first)
					function sortResults (a, b) {
						return a.venue.stats.checkinsCount-b.venue.stats.checkinsCount;
					}

					//build new array with sorted items
					var itemsArray = data.response.groups[0].items;
					console.log(itemsArray);

					//reverse the order of sorted results so highest checkinsCount is first
					function reorderResults () {
						itemsArray.sort(sortResults);
						itemsArray.reverse();
					}
					reorderResults();
					
					//build html for top 5 in itemsArray	
					function appendResults () {
					
						for (i=0; i<5; i++){

						var result = $('.venueSummaryTemplateHidden').find('.venueSummary').clone();
						$('.venuesWrapper').append(result);
						
						//set rank in result
						var rankIcon = result.find('.rankIcon');
						rankIcon.html('<p class="rankIconP">#' + (i+1) + '</p>');

						//set venue icon in result
						var venueIconImg = result.find('.venueIconImg');
						venueIconImg.attr('src', itemsArray[i].venue.categories[0].icon.prefix + 'bg_64.png');

						// set venue url in result
						var venueURL = result.find('.venueURL a');
						venueURL.attr('href', itemsArray[i].venue.url);
						venueURL.html('<p>' + itemsArray[i].venue.name + '</p> ');

						// set venue description in result
						var fadeVenueDescription = result.find('.fadeVenueDescription');
						fadeVenueDescription.html('<p class="descriptionP">' + itemsArray[i].venue.categories[0].shortName + '</p>');

						//set venue checkins in result
						var venueCheckins = result.find('.venueCheckins');
						venueCheckins.html('<i class="fa fa-check fa-2x"></i><p>' + itemsArray[i].venue.stats.checkinsCount + ' check-ins</p>');

						//set venue address in result
						var venueAddress = result.find('.venueAddress');
						venueAddress.html('<i class="fa fa-map-marker fa-2x"></i><p>' + itemsArray[i].venue.location.formattedAddress[0] + '<br/>' + itemsArray[i].venue.location.formattedAddress[1] + '</p>');

						//set google map in result
						var googleFrame = result.find('.googleFrame');
						var googleSource = ('https://www.google.com/maps/embed/v1/place?key=AIzaSyA9urJt5dg5t10saMe89oZJcsUL0BKbGec&q=' +  itemsArray[i].venue.name + "'");
						googleFrame.attr('src', googleSource);
						
						//set venue tip in result
						var venueTip = result.find('.venueTip');
						venueTip.html('<div class="tipIcon">tip</div><p>' + itemsArray[i].tips[0].text + '</p><div class="fadeDiv"></div>');
						
						}
						
					}
					
					//wait for all data to load then shows results
					setTimeout(function(){	
					appendResults();
					$('#blue').fadeOut(1000);
					$('.searchParagraph').fadeOut(500);
					$('.venuesWrapper').fadeIn();
					changeBirds();
					}, 5000);
					
					}//else
					
				},

				error: function(data, xhr) {
	                console.log(xhr);


	        	}

		});
	
	};

	//show google map 
	$('.venuesWrapper').on('click', '.venueAddress', function() {
		//googleFrame.attr('src', googleSource);
		$(this).siblings('.googleFrame').toggleClass('showMap');
	});

	//toggle category with venue name on hover
	$('.venuesWrapper').on('mouseover', '.venueIconImg', function() {
		$(this).siblings('.fadeVenueName').hide();
		$(this).siblings('.fadeVenueDescription').show();
	});

	$('.venuesWrapper').on('mouseout', '.venueIconImg', function() {
		$(this).siblings('.fadeVenueName').show();
		$(this).siblings('.fadeVenueDescription').hide();
	});

	$('.logoH2').on('click', function(){
		location.reload();
	});

	$('#newSearchP').on('click', function(){
		$('#searchErrorWrapper').fadeOut(500);
		$('#locationInputBox').focus();
		changeBirds();
	});

	$('.venuesWrapper').on('click', '.venueTip', function() {
		$(this).toggleClass('less');
		$(this).children('.fadeDiv').toggleClass('hidden');
	});

	var externalLink = $(' ' + '<i id="externalLink" class="fa fa-external-link"></i>');
	$('.venuesWrapper').on('mouseover', '.venueURL p', function() {
		$(this).append(externalLink);
	});
	$('.venuesWrapper').on('mouseout', '.venueURL p', function() {
		$(externalLink).remove();
	});

});//doc ready
