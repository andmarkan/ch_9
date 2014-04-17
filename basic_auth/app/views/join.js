var ModalView = require('views/modal');
var Handlebars = require('handlebars');
var Templates = require('templates/compiledTemplates')(Handlebars);

var JoinView = ModalView.extend({

  template: Templates['join'],

});
module.exports = JoinView;
