var ModalView = require('views/modal');
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);

var LoginView = ModalView.extend({

  template: Templates['login'],

});
module.exports = LoginView;

