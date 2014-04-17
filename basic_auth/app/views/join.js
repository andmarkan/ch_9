var ModalView = require('views/modal');
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);
var $ = require('jquery-untouched');

var User = require('models/user');

var JoinView = ModalView.extend({

  template: Templates['join'],

  events: {
    'submit': 'registerUser'
  },

  registerUser: function(ev) {
    ev.preventDefault();
    console.log(ev);
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
          console.log(response);
        }
      }
    );
  },

  initialize: function() {
    this.user = new User();
    this.listenTo(this.user, 'all', function(ev) { console.log(ev) });
  }

});
module.exports = JoinView;
