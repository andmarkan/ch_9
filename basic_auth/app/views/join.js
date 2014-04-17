var Backbone = require('backbone');
var _ = require('underscore');
var $ = Backbone.$;
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);

var JoinView = Backbone.View.extend({

  className: 'ui-modal',

  template: Templates['join'],

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});
module.exports = JoinView;
