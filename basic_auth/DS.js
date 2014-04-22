// We require the filesystem library first
var fs = require('fs');
var sha1 = require('sha1');
var _ = require('underscore');

var getCookies = require('./lib/getCookies');

// Next, we require the Promise library
var Promise = require('bluebird');

// We need to wrap the methods from the filesystem with:
Promise.promisifyAll(fs);

// prepare Data
var fileName = "./movies.json";
var Movies = fs.readFileAsync(fileName, "utf8")
  .then(JSON.parse);

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

     // would be DB query
     var match = _.find(movies, function(movie) { return sha1(movie.title) === key });
     if (!match) { return new Promise.reject("ID not found"); }
     return new Promise.resolve(match);
   }) 
   .then(_mapAllAttributes);
 },


 voteMovie: function(id, vote, voter) {
   var that = this;
   return Movies
     .then(function() {
       that.voteExists(id, 0)
       that.addVote(vote, id, voter)
       var score = that.computeScore(id)
       that.updateScore(id, score);
       return that.showMovie(id);
     });
  }, 

 voteExists: function(id, voter) {
   console.log("... check for duplicates:  ", id);
 },

 addVote: function(vote, key, user) {
   console.log("... add vote for:  ", key);
   Movies.then(function(movies) {
     var match = _.find(movies, function(movie) { return sha1(movie.title) === key });
     if (!match) {
       return new Promise.reject("ID not found");
     } else {
       match.rating += 1;
     }
   });
 },

 computeScore: function(key) {
   console.log("... compute score for:  ", key);
 },

 updateScore: function(key, score) {
   console.log("... save score for:  ", key);
 },

 createUser: function(req) {
   return _checkDuplicates(req)
     .then(_createUser);
 },

 checkAuth: function(req) {
   var cookies = getCookies(req);
 
   var activeUser = _.findWhere(Users, { token: cookies.session });
   if (!activeUser) {
     return Promise.reject("No Session")
   }
   return Promise.resolve(_returnUser(activeUser));
 },

 authUser: function(req) {
   return _matchPasswords(req).then(_generateToken);
 }
}

function _checkDuplicates(raw) {
   var username = raw.username;

   // would require DB access
   var existingUser = _.findWhere(Users, {username: username});
   if (existingUser) {
     return Promise.reject(new Error('Username taken.'));
   }
   return new Promise.resolve(raw);
}

function _createUser(raw) {
   var userId = Users.length + 1;
   var newUser = {
       id: userId,
       username: raw.username,
       password: raw.password,
       email: raw.email
   };

   // would require DB access
   Users.push(newUser);
   return Promise.resolve(_returnUser(newUser));
}

function _returnUser(newUser) {
  return _.pick(newUser, 'username', 'id')
}

function _matchPasswords(req) {
   var activeUser = _.findWhere(Users, { username: req.query.username });
   if (activeUser.id !== null && raw.password === activeUser.password) {
     return Promise.resolve(activeUser);
   } else {
     return Promise.reject('username not found');
   }

}

// would require DB access
function _generateToken(activeUser) {
   var token = sha1(_.now().toString());
   activeUser.auth = token;
   return new Promise.resolve(activeUser);
}


// Last, we export the MoviesReader as module
module.exports = MoviesReader;

