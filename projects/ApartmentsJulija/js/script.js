function myMap(){
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

function validate(status){

  //pull data from input fields
  var checkIn = new Date($("#checkIn").val());
  var numDays = parseInt($("#numDays").val());
  var numAdults = parseInt($("#numAdults").val());
  var numKids = parseInt($("#numKids").val());
  var people = numAdults+numKids;
  var validated = false;

  var data = {"checkIn": checkIn, "numDays": numDays, "numAdults": numAdults, "numKids": numKids, "people": people};

  //reset style
  $("#numAdults").removeClass("w3-red");
  $("#numKids").removeClass("w3-red");
  $("#checkIn").removeClass("w3-red");
  $("#numDays").removeClass("w3-red");

  //validate dates
  if (!checkIn.getDate()) {
    $("#checkIn").addClass("w3-red");
  }
  else if (numDays<6 || numDays>28) {
    $("#numDays").addClass("w3-red");
    alert("Minimum 6 Days Reservations!");
  }
  //validate people
  else if (numAdults>6 || numAdults<2) {
    $("#numAdults").addClass("w3-red");
  }
  else if (numKids>4 || numKids < 0) {
    $("#numKids").addClass("w3-red");
  }
  else if (people>6) {
    $("#numKids").addClass("w3-red");
    $("#numAdults").addClass("w3-red");
  }
  //extra constraints
  else if (checkIn.getDay()!=6) {
    alert ("Check In Only On Saturday!")
  }
  else {
    //alert(JSON.stringify(data));
    var estimatedPrice=0;
    var month=checkIn.getMonth()+1;
    if (month>4 && month<6) {
      estimatedPrice=35;
    }
    else if (month>5 && month<9) {
      estimatedPrice=45;
    }
    else if (month>8 && month<11 ) {
      estimatedPrice=30;
    }
    $("#confirmPanel").removeClass("w3-hide");
    $("#checkInConfirm").text(checkIn.getDate()+". "+(checkIn.getMonth()+1)+". "+checkIn.getFullYear());
    $("#numDaysConfirm").text(numDays);
    $("#numAdultsConfirm").text(numAdults);
    $("#numKidsConfirm").text(numKids);
    $("#priceConfirm").text((estimatedPrice*numDays)+"€");
    validated=true;
  }

  if (status==1 && validated) {
    postDataToApi("Backend not yet implemented! Data for backend: "+JSON.stringify(data));
  }
}

function postDataToApi(data) {

  alert(JSON.stringify(data));

  //AJAX call MyApi
  $.ajax({
      type: 'POST',
      dataType: 'json',
      url: "https://localhost:8000/api",
      data: data,
      success: function(data,status) {

      }
  });
}

var app = angular.module('content', []);
app.controller('localizationCtrl', function($scope) {
    $scope.apartments = "Apartments";
    $scope.about = "About";
    $scope.events = "Events";
    $scope.contact = "Contact";
    $scope.map = "Map";
    $scope.book_now = "Book Now"
});
app.controller('galleryCtrl', function($scope) {

    $scope.app11="img/A1/1.jpg";
    $scope.app12="img/A1/2.jpg";
    $scope.app13="img/A1/3.jpg";
    $scope.app14="img/A1/4.jpg";
    $scope.app15="img/A1/5.jpg";
    $scope.app16="img/A1/6.jpg";
    $scope.app17="img/A1/7.jpg";
    $scope.app18="img/A1/8.jpg";
    $scope.app19="img/A1/9.jpg";

    $scope.app21="img/A2/1.jpg";
    $scope.app22="img/A2/2.jpg";
    $scope.app23="img/A2/3.jpg";
    $scope.app24="img/A2/4.jpg";
    $scope.app25="img/A2/5.jpg";
    $scope.app26="img/A2/6.jpg";
    $scope.app27="img/A2/7.jpg";
    $scope.app28="img/A2/8.jpg";

    $scope.app31="img/A3/1.jpg";
    $scope.app32="img/A3/2.jpg";
    $scope.app33="img/A3/3.jpg";
    $scope.app34="img/A3/4.jpg";
    $scope.app35="img/A3/5.jpg";
    $scope.app36="img/A3/6.jpg";
    $scope.app37="img/A3/7.jpg";
    $scope.app38="img/A3/8.jpg";

    $scope.app41="img/A4/1.jpg";
    $scope.app42="img/A4/2.jpg";
    $scope.app43="img/A4/3.jpg";
    $scope.app44="img/A4/4.jpg";
    $scope.app45="img/A4/5.jpg";
    $scope.app46="img/A4/6.jpg";
    $scope.app47="img/A4/7.jpg";
    $scope.app48="img/A4/8.jpg";

    $scope.app51="img/A5/1.jpg";
    $scope.app52="img/A5/2.jpg";
    $scope.app53="img/A5/3.jpg";
    $scope.app54="img/A5/4.jpg";
    $scope.app55="img/A5/5.jpg";
    $scope.app56="img/A5/6.jpg";
    $scope.app57="img/A5/7.jpg";

    $scope.app61="img/A6/1.jpg";
    $scope.app62="img/A6/2.jpg";
    $scope.app63="img/A6/3.jpg";
    $scope.app64="img/A6/4.jpg";
    $scope.app65="img/A6/5.jpg";
    $scope.app66="img/A6/6.jpg";
    $scope.app67="img/A6/7.jpg";
    $scope.app68="img/A6/8.jpg";
    $scope.app69="img/A6/9.jpg";

    $scope.app71="img/A7/1.jpg";
    $scope.app72="img/A7/2.jpg";
    $scope.app73="img/A7/3.jpg";
    $scope.app74="img/A7/4.jpg";
    $scope.app75="img/A7/5.jpg";
    $scope.app76="img/A7/6.jpg";
    $scope.app77="img/A7/7.jpg";
    $scope.app78="img/A7/8.jpg";
    $scope.app79="img/A7/9.jpg";
    $scope.app710="img/A7/10.jpg";
    $scope.app711="img/A7/11.jpg";

    $scope.app81="img/A8/1.jpg";
    $scope.app82="img/A8/2.jpg";
    $scope.app83="img/A8/3.jpg";
    $scope.app84="img/A8/4.jpg";
    $scope.app85="img/A8/5.jpg";
    $scope.app86="img/A8/6.jpg";
    $scope.app87="img/A8/7.jpg";

});

// $(document).ready(function(){

//   $("#show_contact").click(function(){
//       $("#contact").removeClass("w3-hide");
//       $("#about").addClass("w3-hide");
//       $("#apartments").addClass("w3-hide");
//       $("#events").addClass("w3-hide");
//   });

//   $("#show_about").click(function(){
//       $("#about").removeClass("w3-hide");
//       $("#contact").addClass("w3-hide");
//       $("#apartments").addClass("w3-hide");
//       $("#events").addClass("w3-hide");
//   });

//   $("#show_events").click(function(){
//       $("#events").removeClass("w3-hide");
//       $("#contact").addClass("w3-hide");
//       $("#apartments").addClass("w3-hide");
//       $("#about").addClass("w3-hide");
//   });

//   $("#show_apartments").click(function(){
//       $("#apartments").removeClass("w3-hide");
//       $("#contact").addClass("w3-hide");
//       $("#about").addClass("w3-hide");
//       $("#events").addClass("w3-hide");
//   });

//   $("#show_all").click(function(){
//       $("#apartments").removeClass("w3-hide");
//       $("#contact").removeClass("w3-hide");
//       $("#about").removeClass("w3-hide");
//       $("#events").removeClass("w3-hide");
//   });

// });

function currentDiv(n,a,b) {
  showDivs(slideIndex = n,a,b);
}

function showDivs(n,a,b) {
  var i;
  var x = document.getElementsByClassName(a);
  var dots = document.getElementsByClassName(b);
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-opacity-off", "");
  }
  x[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " w3-opacity-off";
}

