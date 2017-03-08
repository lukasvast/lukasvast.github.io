function myMap()
{
  myCenter=new google.maps.LatLng(45.183672, 14.6810937);
  var mapOptions= {
    center:myCenter,
    zoom:16, scrollwheel: false, draggable: false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);

  var marker = new google.maps.Marker({
    position: myCenter,
  });
  marker.setMap(map);
}

var app = angular.module('navBar', []);
app.controller('navBarCtrl', function($scope) {
    $scope.apartments = "Apartments";
    $scope.about = "About";
    $scope.contact = "Contact";
    $scope.map = "Map";
    $scope.book_now = "Book Now";
});


$(document).ready(function(){

  $("#show_nav_bar").click(function(){
      $("#nav_bar").show();
      $("#show_nav_bar").addClass("w3-hide");
  });

  $("#close_nav_bar").click(function(){
      $("#nav_bar").hide();
      $("#show_nav_bar").removeClass("w3-hide");
  });

  $("#show_contact").click(function(){
      $("#contact").removeClass("w3-hide");
      $("#about").addClass("w3-hide");
      $("#about_mobile").addClass("w3-hide");
      $("#apartments").addClass("w3-hide");
  });

  $("#show_about").click(function(){
      $("#about").removeClass("w3-hide");
      $("#about_mobile").removeClass("w3-hide");
      $("#contact").addClass("w3-hide");
      $("#apartments").addClass("w3-hide");
  });

  $("#show_apartments").click(function(){
      $("#apartments").removeClass("w3-hide");
      $("#contact").addClass("w3-hide");
      $("#about").addClass("w3-hide");
      $("#about_mobile").addClass("w3-hide");
  });

  $("#first_floor_gallery").click(function(){
      $("#first_floor").removeClass("w3-hide");
      $("#second_floor").addClass("w3-hide");
      $("#third_floor").addClass("w3-hide");
  });

  $("#second_floor_gallery").click(function(){
      $("#second_floor").removeClass("w3-hide");
      $("#first_floor").addClass("w3-hide");
      $("#third_floor").addClass("w3-hide");
  });

  $("#third_floor_gallery").click(function(){
      $("#third_floor").removeClass("w3-hide");
      $("#first_floor").addClass("w3-hide");
      $("#second_floor").addClass("w3-hide");
  });

});
