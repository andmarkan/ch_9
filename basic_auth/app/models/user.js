var Backbone = require('backbone');
var _ = require('underscore');

var UserModel = Backbone.Model.extend({
    defaults: {
      username: '',
      email: ''
    },

    urlRoot: '/api/auth/create_user',

    validate: function(attrs) {
      var errors = this.errors = {};
      if (!attrs.username) errors.firstname = 'username is required';
      if (!attrs.email) errors.email = 'email is required';
      if (!_.isEmpty(errors)) return errors;
    },

    signup: function(attrs) {
      var that = this;
      this.save(attrs, {success: function(model, response) {
          that.trigger('signup:success');
        },
        error: function(model, response) {
          var error = JSON.parse(response.responseText).error;
          that.validationError = {"username": error};
          that.trigger('invalid', that);
        }
      });
    },

    save: function(attrs, options) {
      options || (options = {});
      
      options.contentType = 'application/json';
      options.data = JSON.stringify(attrs);
      
      return Backbone.Model.prototype.save.call(this, attrs, options);
    }
});

module.exports = UserModel;
