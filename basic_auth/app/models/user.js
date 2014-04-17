var Backbone = require('backbone');

var UserModel = Backbone.Model.extend({
    defaults: {
      username: '',
      email: ''
    },

    urlRoot: '/api/auth/create_user',

    save: function(attrs, options) {
      options || (options = {});
      
      options.contentType = 'application/json';
      options.data = JSON.stringify(attrs);
      console.log(options.data);
      
      Backbone.Model.prototype.save.call(this, attrs, options);
    }
});

module.exports = UserModel;
