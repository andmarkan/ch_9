// We require the filesystem library first
var fs = require('fs');
var fileName = "./movies.json";
var sha1 = require('sha1');
var _ = require('underscore');

var getCookies = require('./lib/getCookies');

// Next, we require the Promise library
var Promise = require('bluebird');

// We need to wrap the methods from the filesystem with:
Promise.promisifyAll(fs);

var Movies;

// prepare Data

var Movies = fs.readFileAsync(fileName, "utf8")
  .then(function(f) {
    return JSON.parse(f);
  })
  .then(function(movies) {
    return Promise.resolve(movies);
  });

var Users = [];


function _mapAttributes(movie) {
  return {
    id: movie.id,
    title: movie.title,
    _key: sha1(movie.title),
  };
};


function _mapGenres(movie) { 
  return movie.genres 
};

function _mapAllAttributes(movie) {
  return {
    title: movie.title,
    description: movie.description,
    showtime: movie.showtime,
    rating: movie.rating,
    genres: movie.genres,
    _key: sha1(movie.title),
  };
};



// We will later export this to a module
var MoviesReader = {

  allMovies: function() {
    return Movies
     .map(_mapAttributes)
  },

  allGenres: function() {
    return Movies
     .map(_mapGenres)
     .then(function(genres) {
       return _.chain(genres)
        .flatten()
        .uniq()
        .value();
     });
  },

 showMovie: function(key) {
   return Movies.then(function(movies) {
     var match = _.find(movies, function(movie) { return sha1(movie.title) == key });
     if (!match) {
       throw new Promise.RejectionError("ID not found");
     } else {
       return match;
     }
   }) 
   .then(_mapAllAttributes);
 },


 voteMovie: function(id, vote, voter) {
   var that = this;
   return Movies
     .then(function() {
       return that.voteExists(id, 0)
     })
     .then(function(result) {
       that.addVote(vote, id, voter)
     })
     .then(function() {
        that.computeScore(id)
      })
     .then(function(score) {
        that.updateScore(id, score);
     })
     .then(function() {
       return that.showMovie(id);
     });
  }, 

 voteExists: function(id, voter) {
   console.log("... check for duplicates:  ", id);
 },

 addVote: function(vote, key, user) {
   console.log("... add vote for:  ", key);
   Movies.then(function(movies) {
     var match = _.find(movies, function(movie) { return sha1(movie.title) == key });
     if (!match) {
       throw new Promise.RejectionError("ID not found");
     } else {
       match.rating += 1;
       console.log(match);
       return match;
     }
   });
 },

 computeScore: function(key) {
   console.log("... compute score for:  ", key);
 },

 updateScore: function(key, score) {
   console.log("... save score for:  ", key);
 },

 createUser: function(raw) {
   var userId = Users.length + 1;
   var newUser = {
       id: userId,
       username: raw.username,
       password: raw.password,
       email: raw.email
     };
   Users.push(newUser);
   return Promise.resolve(_.pick(newUser, 'username', 'id'));
 },

 checkAuth: function(req) {
   var cookies = getCookies(req);
 
   var activeUser = _.findWhere(Users, { token: cookies.session });
   if (!activeUser) {
       throw "No Session"
   }
   return Promise.resolve(_.pick(activeUser, 'username', 'id'));
 },

 authUser: function(req) {

   var activeUser = _.findWhere(Users, { username: req.query.username });

   if (activeUser.id !== null && raw.password === activeUser.password) {
     var token = sha1(_.now().toString());
     activeUser.auth = token;
     return Promise.resolve(activeUser);
   } else {
     return Promise.RejectionError('username not found');
   }
 }
}


// Last, we export the MoviesReader as module
module.exports = MoviesReader;

