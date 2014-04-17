var Backbone = require('backbone');
var Genre = require('models/genre');

var Genres = Backbone.Collection.extend({

  url: '/api/genres',

  model: Genre


});
module.exports = Genres;
