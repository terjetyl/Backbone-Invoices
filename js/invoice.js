(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Invoice = (function() {
    __extends(Invoice, Backbone.Model);
    function Invoice() {
      Invoice.__super__.constructor.apply(this, arguments);
    }
    Invoice.prototype.initialize = function() {};
    Invoice.prototype.defaults = {
      date: new Date,
      number: 000001,
      seller_info: null,
      buyer_info: null
    };
    Invoice.prototype.formattedDate = function() {
      return $.format.date(this.get('date').toString(), 'dd/MM/yyyy');
    };
    return Invoice;
  })();
  window.InvoiceForm = (function() {
    __extends(InvoiceForm, Backbone.View);
    function InvoiceForm() {
      InvoiceForm.__super__.constructor.apply(this, arguments);
    }
    InvoiceForm.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.template = _.template($('#invoice-form-template').html());
    };
    InvoiceForm.prototype.render = function() {
      var rendered_content;
      rendered_content = this.template({
        model: this.model
      });
      $(this.el).html(rendered_content);
      return this;
    };
    return InvoiceForm;
  })();
}).call(this);
