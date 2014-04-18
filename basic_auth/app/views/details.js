var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');

var DetailsView = Backbone.View.extend({
  el: '#details',

  template: _.template('<h1><%= showtimeFormatted %> - <%= title %></h1>\
                        <br>rating: <%= rating %> \
                        <br> <%= description %>'),
  formatShowtime: function() {
    return moment(this.model.get('showtime')).format("DD-MMMM HH:MM");
  },

  render: function() {
    var data = _.extend(this.model.toJSON(), {showtimeFormatted: this.formatShowtime()});
    this.$el.html(this.template(data));
    return this;
  }
});
module.exports = DetailsView;
