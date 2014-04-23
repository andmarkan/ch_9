var Backbone = require('backbone');
var ModalView = require('views/modal');
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);
var $ = require('jquery-untouched');
var _ = require('underscore');

var User = require('models/user');

var JoinView = ModalView.extend({

  template: Templates['join'],

  events: {
    'submit': 'registerUser'
  },

  render: function() {
    ModalView.prototype.render.call(this);
    this.delegateEvents();
    this.$error = this.$el.find('.error');
    return this;
  },

  registerUser: function(ev) {
    ev.preventDefault();
    this.user.clear();
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();
    var email = $('input[name=email]').val();

    var that = this;
    this.user.signup({username: username, password: password, email: email});
  },

  renderError: function(err, options) {
    var errors = _.map(_.keys(err.validationError), function(key) {
      return err.validationError[key];
    })
    this.$error.text(errors);
  },

  renderThanks: function() {
    this.$el.find('.join').html('thanks for signup');
  },

  initialize: function() {
    this.user = new User();
    this.listenTo(this.user, 'all', function(ev) { console.log(ev) });
    this.listenTo(this.user, 'invalid', this.renderError);
    this.listenTo(this.user, 'signup:success', this.renderThanks);
    return ModalView.prototype.initialize.call(this);
  }

});
module.exports = JoinView;
