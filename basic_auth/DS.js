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
  .then(JSON.parse);

function _mapAttributes(movie) {
  return {
    id: movie.id,
    title: movie.title,
    _key: sha1(movie.title),
  };
}

function _mapAllAttributes(movie) {
  return {
    title: movie.title,
    description: movie.description,
    showtime: movie.showtime,
    rating: movie.rating,
    genres: movie.genres,
    _key: sha1(movie.title),
  };
}

function _find(movies, key) {
  var match = _.find(movies, function(movie) { return movie.id === parseInt(key) });
  if (!match) {
    throw new Promise.RejectionError("ID not found");
  } else {
    return match;
  }
}

function _mapGenres(movies) {
  return _.chain(movies)
  .map(function(movie) { 
    return movie.genres 
  })
  .flatten()
  .uniq()
  .value();
}

function _findBySha(movies, key) {
  var match = _.find(movies, function(movie) { return sha1(movie.title) === key });
  if (!match) {
    throw new Promise.RejectionError("ID not found");
  } else {
    return match;
  }
}


var DS = function() {};

DS.prototype.allMovies = function() {
    return Movies
     .map(_mapAttributes);
}

DS.prototype.allGenres = function() {
  return Movies.then(_mapGenres);
}

DS.prototype.voteMovie = function(id, vote, voter) {
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
       return that.findBySha(id);
     });
  } 

DS.prototype.voteExists = function(id, voter) {
   console.log("... check for duplicates:  ", id);
 },

DS.prototype.addVote = function(vote, key, user) {
   console.log("... add vote for:  ", key);
   Movies.then(function(movies) {
     var match = _.find(movies, function(movie) { return sha1(movie.title) === key });
     if (!match) {
       throw new Promise.RejectionError("ID not found");
     } else {
       match.rating += 1;
       console.log(match);
       return match;
     }
   });
}

DS.prototype.computeScore = function(key) {
   console.log("... compute score for:  ", key);
}

DS.prototype.updateScore = function(key, score) {
   console.log("... save score for:  ", key);
}

DS.prototype.find = function(key) {
   return Movies.then(function(movies) {
     return _find(movies, key);
   }) 
   .then(_mapAllAttributes);
}

DS.prototype.findBySha = function(key) {
   return Movies.then(function(movies) {
     return _findBySha(movies, key);
   }) 
   .then(_mapAllAttributes);
}

// DS for users and sessions

var Users = [];

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
   return _returnUser(newUser);
}


function _findByUsername(username) {
  var user = _.findWhere(Users, {username: username});
  return Promise.resolve(user);
}


function _returnUser(newUser) {
  console.log(newUser);
  return _.pick(newUser, 'username', 'id')
}

function _checkDuplicates(raw) {
   var username = raw.username;

   // would require DB access
   return _findByUsername(username).then(function(existingUser) {

     if (existingUser) {
       return Promise.reject(new Error('Username taken.'));
     }
     return raw;
   });
}

DS.prototype.createUser = function(req) {
  // var raw = JSON.parse(req.body);
  var raw = req.body;
  return _checkDuplicates(raw)
    .then(_createUser);
}

// data store operations to authenticate a user
function _matchPasswords(req) {
  console.log(req.body.username);
  return _findByUsername(req.body.username).then(function(activeUser) {
    console.log(activeUser);
     if (activeUser && req.body.password === activeUser.password) {
       return activeUser;
     } else {
       return Promise.reject(new Error('username not found'));
     }
  });
}

function _generateToken(activeUser) {
   var token = sha1(_.now().toString()); // generate a unique token
   activeUser.token = token;
   return activeUser;
}

DS.prototype.authUser = function(req) {
  return _matchPasswords(req).then(_generateToken);
}

function _findUserByToken(req) {
  var cookies = getCookies(req);
  console.log(cookies);
  var user = _.findWhere(Users, { token: cookies.session });
  console.log(user);
  console.log('----');
  return Promise.resolve(user);
}

DS.prototype.checkAuth = function(req) {
  return _findUserByToken(req).then(function(activeUser) {
    if (!activeUser) {
      return Promise.reject("No Session")
    }
    return _returnUser(activeUser);
  });
}

DS.prototype.clearSession = function(req) {
  return _findUserByToken(req).then(function(activeUser) {
    if (activeUser) {
      activeUser.auth = null;
    }
    return activeUser;
  });
}


// Last, we export the MoviesReader as module
module.exports = DS;

