var Backbone = require('backbone');
var _ = require('underscore');
var $ = Backbone.$;
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);

var LoginView = Backbone.View.extend({

  template: Templates['login'],

  className: 'ui-modal modal',

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});
module.exports = LoginView;

