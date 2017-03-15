// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

var api_key="349a4881349e36583f3d5b02876c8791";

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
          $("#photo_grid").append('<div class="w3-third"><img src="'+img_src+'" style="width:100%" onclick="onClick(this)" alt="Description."></div>')
        }
    });

}
