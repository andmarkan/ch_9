var restify = require('restify');
var _ = require('underscore');

var DS = require('./DS');

var server = restify.createServer({ name: 'api' })

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

var ds = new DS();

// The main API route for movies
server.get('/api/movies', function (req, res, next) {
  ds.allMovies()
    .then(function(m) { res.send(m); })
    .catch(function(err) { res.send(500, err) });
});

server.get("/api/movies/:key", function(req, res, next) {
    ds.find(req.params.key)
             .then(function(m) { res.send(m); })
             .error(function (e) {
               res.send(400, {err: e.message});
             })
            .catch(function(err) { res.send(500, err) });
});

server.put("/api/movies/:key", function(req, res, next) {
    ds.voteMovie(req.params.key, req.body.vote)
             .then(function(m) { res.send(m); })
             .error(function (e) {
               res.send(400, e.message);
             })
            .catch(function(err) { res.send(500, err) });
});


// The API route to extract a genres of movies
server.get('/api/genres', function (req, res, next) {
  ds.allGenres()
    .then(function(m) { res.send(m); })
    .catch(function(err) { res.send(500, err) });
});


// API for sessions
server.post('/api/auth/create_user', function(req, res, next) {
  ds.createUser(req)
    .then(function(user) {
       res.send({id: user.id, username: user.username});
    })
    .error(function(err) {
       res.send(422, { error: err.message });
    })
    .catch(function(err) {
      console.log(err);
      res.send(500, { error: err });
  });
});

server.post('/api/auth/session', function(req, res, next) {

  if (!req.body.username || !req.body.password) {
    res.send(422, {status: 'err',
      error: 'Username and password are two required fields.'
    });
    next();
  }

  ds.authUser(req)
    .then(function(activeUser) {
      res.header('Set-Cookie', 'session=' + activeUser.token 
                  + '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/; HttpOnly');
      res.send({ auth: "OK", id: activeUser.id, 
                 username: activeUser.username,
                 email: activeUser.email });
    })
    .error(function(err) {
      res.header('Set-Cookie', 'session=; HttpOnly') 
      res.send(403, { auth: "NOK", error: err.message });
    })
    .catch(function(err) {
      console.log("/auth/session: %", err);
      res.send(401, { auth: "NOK" });
    })
});

server.get('/api/auth/session', function(req, res, next) {
  ds.checkAuth(req)
    .then(function(user) {
      res.send({ auth: "OK", id: user.id, username: user.username });
    })
    .error(function(err) {
      res.header('Set-Cookie', 'session=; HttpOnly') 
      res.send(403, { auth: "NOK", error: err.message });
    })
    .catch(function(err) {
      console.log(err);
      res.header('Set-Cookie', 'session=; HttpOnly')
      res.send(500, { auth: "NOK" });
  });
})

server.del('/api/auth/session', function(req, res, next) {
  ds.clearSession(req)
    .then(function() {
      res.header('Set-Cookie', 'session=; HttpOnly')
      res.send(200, {auth: 'NOK'});
    });
});

var port = process.env.PORT || 5001;
server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url)
})
