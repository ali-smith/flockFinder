//endpoit: https://www.google.com/maps/embed/v1/MODE?key=API_KEY&parameters
//key: AIzaSyA9urJt5dg5t10saMe89oZJcsUL0BKbGec
//mode = place

//https://www.google.com/maps/embed/v1/place
// ?key=API_KEY
//&q=Fisht+Olympic+Stadium,Sochi+Russia

//MY ENDPOINT:
//'https://www.google.com/maps/embed/v1/place?key=AIzaSyA9urJt5dg5t10saMe89oZJcsUL0BKbGec&q=' +  

var result = $.ajax({
		url: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyA9urJt5dg5t10saMe89oZJcsUL0BKbGec&q=' +  itemsArray[i].venue.location.address + itemsArray[i].venue.location.city + itemsArray[i].venue.location.state + itemsArray[i].venue.location.postalCode + itemsArray[i].venue.location.country + "'")
		data: request,
		dataType: "jsonp",
		type: "GET"
		})