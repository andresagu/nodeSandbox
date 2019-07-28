require("dotenv").config();
var Spotify = require('node-spotify-api');
// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
// ...
var Axios = require("axios")

var Moment = require("moment")

var fs = require('fs');



var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);


var concertSearch = function(argArray){
  var artistName = (argArr) => argArr.join("+")

  var queryUrl = "https://rest.bandsintown.com/artists/" + artistName(argArray) + "/events?app_id=codingbootcamp";


  Axios.get(queryUrl)
  .then(function (response) {
    // handle success
    let fullData = response.data

    fullData.forEach(function(data,index){
      console.log("-----------------------------");
      console.log("VENUE: "+ data.venue.name);
      console.log("LOCATION: "+data.venue.city +", "+data.venue.country);
      //CREATE A MOMENT AND FORMAT IT WITH "LL"
      let date = Moment(data.datetime)
      console.log("DATE & TIME: "+ date.format('LL'));

    });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
}

var searchMovie = function(argArray){

  var queryUrl;

  var movieName = (argArr) => argArr.join("+")
    // Then run a request with axios to the OMDB API with the movie specified
  queryUrl = "http://www.omdbapi.com/?t=" + movieName(argArray) + "&y=&plot=short&apikey=trilogy";

  Axios.get(queryUrl)
  .then(function (response) {
    let fullData = response.data
    let rottenScore = response.data.Ratings[1]
    console.log("-----------------------------------------");
    console.log("TITLE: "+ fullData.Title);
    console.log("YEAR: "+ fullData.Year);
    console.log("IMDB SCORE: " + fullData.imdbRating);
    console.log("ROTTEN TOMATOES: " + rottenScore.Value);
    console.log("COUNTRY: "+ fullData.Country);
    console.log("LANGUAGE: "+ fullData.Language);
    console.log("PLOT: " + fullData.Plot);
    console.log("ACTORS: "+ fullData.Actors);
    console.log("-----------------------------------------");

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

}


var searchSong = function(argArray) {
  var songName = (argArr) => argArr.join(" ")
  spotify.search({ type: 'track', query: songName(argArray), limit: 1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

    let songInfoArr = data.tracks.items
    let songInfo = songInfoArr[0]
    let artistInfoArr = songInfo.album.artists
    let artistInfo = artistInfoArr[0]
    console.log("SONG SEARCH RESULTS");
    console.log("-----------------------------------------");
    console.log("ARTISTS: "+ artistInfo.name);
    console.log("SONG: "+ songInfo.name);
    console.log("LINK: "+ songInfo.external_urls.spotify);
    console.log("ALBUM: "+ songInfo.album.name);
    console.log("-----------------------------------------");
  });

}

var lastCase = function(){

fs.readFile('./random.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    // Invoke the next step here however you like
    console.log(content.toString());   // Put all of the code here (not the best solution)

});

}
//cut input arguments and parse to determine required function
var myArgs = process.argv.slice(2)

const argArray = [...myArgs]

switch(argArray[0]){
  case "concert-this":
    //do concert search
    concertSearch(argArray.slice(1))
    break;
  case "spotify-this-song":
    //search Spotify
    if(argArray.length > 1){
      searchSong(argArray.slice(1))
    }
    else{
      const defArgArray = ["The Sign","Ace of Base"]
      searchSong(defArgArray)
    }
    break;
  case "movie-this":
    //search movieName
    if(argArray.length > 1){
      searchMovie(argArray.slice(1))
    }
    else{
      const defArgArray = ["Mr.Nobody"]
      searchMovie(defArgArray)
    }
    break;
  case "do-what-it-says":
    //i dont even know waht this is supposed to do
    lastCase();
    break;

}
