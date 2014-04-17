var restify = require('restify');
var _ = require('underscore');


var DS = require('./DS');

var server = restify.createServer({ name: 'api' })

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


// The main API route for movies
server.get('/api/movies', function (req, res, next) {
  DS.allMovies()
    .then(function(m) { res.send(m); })
    .catch(function(err) { res.send(500, err) });
});

server.get("/api/movies/:key", function(req, res, next) {
    DS.showMovie(req.params.key)
       .then(function(m) { res.send(m); })
       .error(function (e) {
         res.send(400, e.message);
       })
       .catch(function(err) { res.send(500, err) });
});

server.put("/api/movies/:key", function(req, res, next) {
   DS.voteMovie(req.params.key, req.body.vote)
       .then(function(m) { res.send(m); })
       .error(function (e) {
         res.send(400, e.message);
       })
       .catch(function(err) { res.send(500, err) });
});


// The API route to extract a genres of movies
server.get('/api/genres', function (req, res, next) {
  DS.allGenres().then(function(genres) {
    res.send(genres);
  })
  .catch(function(err) { res.send(500, err) });
});

server.post('/api/auth/create_user', function(req, res, next) {
  DS.createUser(req.body)
    .then(function(user) {
       res.send({id: user.id, username: user.username});
     })
    .catch(function(err) {
       res.send('500', { error: err });
  });
});

server.get('/api/auth/session', function(req, res, next) {

  DS.checkLogin(req)
    .then(function(user) {
      res.send({auth: 'OK', id: id, username: username }); 
    })
    .catch(function(err) {
      // error
      res.header('Set-Cookie', 'session=; HttpOnly') 
      res.status(403);
      res.send({auth: 'NOK'});
  });

});


server.post('/api/auth/session', function(req, res, next) {

  if (!req.query.username || !req.query.password) {
    res.send({status: 'err', error: 'Username and password are two required fields.'});
    return
  }

  var userId;
  var key = getRand();
  DS.authUser(raw.query.username, raw.query.password)
    .then(function(activeUser) {
      res.header('Set-Cookie', 'session=' + activeUser.token + '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/; HttpOnly');
      res.send({auth: 'OK', id: activeUser.id, username: activeUser.username, email: activeUser.email});
    })
    .catch(function(err) {
      console.log("/auth/session: %", err);
      res.send(401, {auth: 'NOK'});
    })
});


var port = process.env.PORT || 5001;
server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url)
});
