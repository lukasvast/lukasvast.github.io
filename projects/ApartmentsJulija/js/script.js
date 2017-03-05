function myMap()
{
  myCenter=new google.maps.LatLng(41.878114, -87.629798);
  var mapOptions= {
    center:myCenter,
    zoom:12, scrollwheel: false, draggable: false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);

  var marker = new google.maps.Marker({
    position: myCenter,
  });
  marker.setMap(map);
}

$(document).ready(function(){

  myObject = {"Apartments" : "Apartments", "About" : "About", "Contact" : "Contact", "Book_Now" : "Book Now"};
  w3.displayObject("nav_bar", myObject);

  $("#show_nav_bar").click(function(){
      $("#nav_bar").show();
      $("#show_nav_bar").addClass("w3-hide");
  });

  $("#close_nav_bar").click(function(){
      $("#nav_bar").hide();
      $("#show_nav_bar").removeClass("w3-hide");
  });

  $("#home").click(function(){
      $("#booking").toggle();
  });

});
/*
$(document).ready(function(){
  myObject = {"Apartments" : "Apartments", "About" : "About", "Contact" : "Contact", "Book_Now" : "Book Now"};
  w3.displayObject("nav_bar", myObject);
});
*/
