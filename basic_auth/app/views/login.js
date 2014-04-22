var ModalView = require('views/modal');
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);
var $ = require('jquery-untouched');
var _ = require('underscore');

var Session = require('models/session');

var LoginView = ModalView.extend({

  template: Templates['login'],

  events: {
    'submit': 'login'
  },

  render: function() {
    ModalView.prototype.render.call(this);
    this.delegateEvents();
    this.$error = this.$el.find('.error');
    return this;
  },

  login: function(ev) {
    ev.preventDefault();
    console.log(ev);
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();

    // ... login action
    var that = this;
    Session.getInstance().login(username, password);
    
  },

  renderError: function(err, options) {
    var errors = _.map(_.keys(err.validationError), function(key) {
      return err.validationError[key];
    })
    this.$error.text(errors);
  },

  initialize: function() {
    this.session = Session.getInstance();
    this.listenTo(this.session, 'all', function(ev) { console.log(ev) });
    this.listenTo(this.session, 'invalid', this.renderError);
    // this.listenTo(this.user, 'signup:fail', this.renderError);
    // this.listenTo(this.user, 'signup:success', this.renderThanks);
    return ModalView.prototype.initialize.call(this);
  }


});
module.exports = LoginView;

