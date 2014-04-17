var Backbone = require('backbone');
var _ = require('underscore');
var $ = Backbone.$;

var ModalView = Backbone.View.extend({

  className: 'ui-modal',

  render: function() {
    this.$el.html(this.template());
    this.$el.delegate('.close', 'click', this.closeModal);
    return this;
  },

  closeModal: function(ev) {
    if (ev) ev.preventDefault();
    this.$el.unbind();
    this.$el.empty();
    this.$el.remove();
  },


  initialize: function() {
    _.bindAll(this, 'render', 'closeModal');
  }

});
module.exports = ModalView;
