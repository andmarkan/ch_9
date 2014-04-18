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
    this.$error.text("aaaaaaaaa");
    return this;
  },

  registerUser: function(ev) {
    ev.preventDefault();
    this.user.clear();
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();
    var email = $('input[name=email]').val();

    var that = this;
    this.user.save({username: username, password: password, email: email}, {
        success: function(model, response) {
          console.log(response);
          that.closeModal();
        },
        error: function(model, response) {
          that.$error.text(response.responseText);
          console.log(response);
        }
      }
    );
  },

  renderError: function(err) {
    var errors = _.map(_.keys(err.validationError), function(key) {
      return err.validationError[key];
    })
    console.log(errors);
    this.$error.text(errors);
  },

  initialize: function() {
    this.user = new User();
    this.listenTo(this.user, 'all', function(ev) { console.log(ev) });
    this.listenTo(this.user, 'invalid', this.renderError);
    return ModalView.prototype.initialize.call(this);
  }

});
module.exports = JoinView;
