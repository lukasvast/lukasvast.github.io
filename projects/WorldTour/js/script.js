function myMap(){

  var mapOptions= {
    center:new google.maps.LatLng(45,13),
    zoom:3,
    scrollwheel: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);

  google.maps.event.addListener(map, "click", function(event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      // populate yor box/field with lat, lng
      //alert("Lat=" + lat + "; Lng=" + lng);
      $("#places").append("<button class='w3-bar-item w3-button w3-blue w3-center' onclick='searchByCoo(this);' data-lat='"+lat+"' data-lng='"+lng+"'>Discover</button>")
      placeMarker(event.latLng, map);
  });
  function placeMarker(position, map) {
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
  }
}

// Clears Discovery Data
function clearData() {
  $("#places").html("");
  $("#photo_grid").html("");
}

// Script to open and close sidebar
function w3_open() {
    $("#mySidebar").show();
    $("#myOverlay").show();
}
function w3_close() {
  $("#mySidebar").hide();
  $("#myOverlay").hide();
}

// Modal Image Gallery
function onClick(element) {
  $("#img").attr('src',element.src);
  //console.log(element.src);
  $("#modal").show();
}

var api_key="349a4881349e36583f3d5b02876c8791";

//search for photos based on coordinates
function searchByCoo(element){
  //alert($(element).attr("data-lat"));
  var lat=$(element).attr("data-lat");
  var lng=$(element).attr("data-lng");
  $(element).addClass("w3-green");
  //alert(lat+lng);
  $("#photo_grid").html("");

  var data = {"method": "flickr.places.findByLatLon", "api_key": api_key, "lat": lat, "lon": lng, "format": "json", "nojsoncallback": "1"};

  //AJAX call to Flicker places find
  $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "https://api.flickr.com/services/rest/",
      data: data,
      success: function(data,status) {
        place_id=data.places.place[0].place_id;
        //console.log(data.places);
        getPhoto(place_id);
        $(element).text(data.places.place[0].woe_name);
      }
  });
}

// search for photos
function searchPhotos() {

  $("#photo_grid").html("");

  var place = $("#place").val();
  var data = {"method": "flickr.places.find", "api_key": api_key, "query": place, "format": "json", "nojsoncallback": "1"};

  //AJAX call to Flicker places find
  $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "https://api.flickr.com/services/rest/",
      data: data,
      success: function(data,status) {
        place_id=data.places.place[0].place_id;
        console.log(data.places);
        getPhoto(place_id);
      }
  });
}

function getPhoto(place_id) {

  var data = {"method": "flickr.photos.search", "api_key": api_key, "place_id": place_id, "per_page": "500", "format": "json", "nojsoncallback": "1"};

  //AJAX call to Flicker photos search
  $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "https://api.flickr.com/services/rest/",
      data: data,
      success: function(data,status) {
        for (var i = 0; i < data.photos.photo.length; i++) {
          displayPhoto(data.photos.photo[i].id);
        }
      }
  });
}

function displayPhoto(photo_id) {

    var data = {"method": "flickr.photos.getSizes", "api_key": api_key, "photo_id": photo_id, "format": "json", "nojsoncallback": "1"};

    //AJAX call to Flicker photos getSizes
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "https://api.flickr.com/services/rest/",
        data: data,
        success: function(data,status) {
          img_src=data.sizes.size[5].source;
          $("#photo_grid").append('<div class="w3-third"><img src="'+img_src+'" style="width:100%" onclick="onClick(this)"></div>')
        }
    });

}
