var buildPhotoLink = function(data, next){
  var farm = data.photos.photo[next].farm;
  var server = data.photos.photo[next].server;
  var id = data.photos.photo[next].id;
  var secret = data.photos.photo[next].secret;

  //assemble the parts into a complete URL for the photo
  var photoURL = "https://farm" + farm + ".staticflickr.com/" + server
  + "/" + id + "_" + secret + "_z.jpg";  //underscore letter signals size of resultb
  // z medium 640, 640 on longest side
  // c medium 800, 800 on longest side
  // b large, 1024 on longest side
  // h large 1600, 1600 on longest side

  return '<img src="' + photoURL + '">';
}

var buildCaptionLink = function(data, next){
  var id = data.photos.photo[next].id;
  var owner = data.photos.photo[next].owner;
  var attrURL = "https://www.flickr.com/photos/" + owner + "/" + id + "/";
  var title = data.photos.photo[next].title;

  return '<a href="' + attrURL + '">' + title + '</a>';
}


var search = function(){
  //get search term entered by user
  var $flickrSearch = $(".searchbox .search-form__input").val();

  //using feed that requires API key
  var flickrBaseURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search"

  var maxResults = 50; // cannot be more than 500

  var api_key = "&api_key=fa3e0832f30851339c73d3dd3c27f961";
  var tags = "&tags=" + $flickrSearch;
  var tagsDog = "&tags=" + $flickrSearch + ",dog,pet";
  var sort = "&sort=relevance";
  var total = "&per_page=" + maxResults;
  var format = "&format=json";
  var nojsoncallback = "&nojsoncallback=1";

  //assemble the parts into complete request
  var flickrReq = flickrBaseURL + api_key + tags + sort + total + format + nojsoncallback;
  var flickrReqDog = flickrBaseURL + api_key + tagsDog + sort + total + format + nojsoncallback;

  function showPhotosDog(data) {
    //randomly choose a photo from the array returned
    var nextDog = Math.floor(Math.random() * maxResults) + 1;

    //assemble HTML for img and title link
    var currentDogPhoto = buildPhotoLink(data, nextDog);
    var currentDogTitle = buildCaptionLink(data, nextDog);

    $('.withDog h3').html($flickrSearch + " with dogs");
    $('.withDog figure').html(currentDogPhoto);
    $(".withDog figcaption").html(currentDogTitle);
  }

  function showPhotosNoDog(data) {
    var nextPic = Math.floor(Math.random() * maxResults) + 1;

    //assemble HTML for img and title link
    var currentPhoto = buildPhotoLink(data, nextPic);
    var currentTitle = buildCaptionLink(data, nextPic);
    $('.noDog h3').html($flickrSearch + " without dogs");
    $('.noDog figure').html(currentPhoto);
    $(".noDog figcaption").html(currentTitle);

  }
  $.getJSON(flickrReq, showPhotosNoDog);
  $.getJSON(flickrReqDog, showPhotosDog);
}

var clearChoices = function(){
  $(".noDog figure").removeClass("highlight");
  $(".withDog figure").removeClass("highlight");
}

var clearVerdict = function(){
  $(".result-container p").html("");
}

$('.searchbox').submit(function(event) {
  clearVerdict();
  search();
  event.preventDefault();
});

$(".again-button").click(function(event){
  clearChoices();
  clearVerdict();
  search();
});

$(".withDog button").click(function(event){
  $(".withDog figure").addClass("highlight");
  $(".noDog figure").removeClass("highlight");
});

$(".noDog button").click(function(event){
  $(".noDog figure").addClass("highlight");
  $(".withDog figure").removeClass("highlight");
});

$(".vote-button").click(function(event){
  var checkNoDog = $(".noDog figure").hasClass("highlight");
  var checkDog = $(".withDog figure").hasClass("highlight");
  if (checkNoDog){
    $(".result-container p").html("Dogs drool...");
  } else if (checkDog){
    $(".result-container p").html("Dogs rule!");
  } else {
    $(".result-container p").html("Please make a selection");
  }
  clearChoices();
});

