var Backbone = require('backbone');
var _ = require('underscore');
var $ = Backbone.$;
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);

var LoginView = require('views/login');
var JoinView = require('views/join');

var NavbarView = Backbone.View.extend({

  template: Templates['navbar'],

  render: function() {
    this.$el.html(this.template({session: false}));
    this.$el.delegate('.login', 'click', this.login);
    this.$el.delegate('.join', 'click', this.join);
    return this;
  },

  login: function(ev) {
    ev.preventDefault();
    console.log('login');
    $('body').append(this.loginView.render().el);
  },

  join: function(ev) {
    ev.preventDefault();
    console.log('join');
    $('body').append(this.joinView.render().el);
  },

  logout: function() {

  },

  initialize: function() {
    _.bindAll(this, 'render', 'login', 'join');
    this.loginView = new LoginView();
    this.joinView = new JoinView();
  }

});
module.exports = NavbarView;
