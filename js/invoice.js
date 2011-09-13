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
      number: '000001',
      seller_info: null,
      buyer_info: null
    };
    Invoice.prototype.formattedDate = function() {
      return $.format.date(this.get('date').toString(), 'dd/MM/yyyy');
    };
    return Invoice;
  })();
  window.InvoiceView = (function() {
    __extends(InvoiceView, Backbone.View);
    function InvoiceView() {
      InvoiceView.__super__.constructor.apply(this, arguments);
    }
    return InvoiceView;
  })();
  window.Invoices = (function() {
    __extends(Invoices, Backbone.Collection);
    function Invoices() {
      Invoices.__super__.constructor.apply(this, arguments);
    }
    Invoices.prototype.model = Invoice;
    Invoices.prototype.localStorage = new window.Store("invoices");
    return Invoices;
  })();
  window.invoices = new Invoices;
  window.InvoiceForm = (function() {
    __extends(InvoiceForm, Backbone.View);
    function InvoiceForm() {
      InvoiceForm.__super__.constructor.apply(this, arguments);
    }
    InvoiceForm.prototype.events = {
      "submit form": "handleSubmit"
    };
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
    InvoiceForm.prototype.handleSubmit = function(e) {
      var data;
      data = {
        date: this.$("input[name='date']").val(),
        number: this.$("input[name='number']").val(),
        buyer_info: this.$("textarea[name='buyer_info']").val(),
        seller_info: this.$("textarea[name='seller_info']").val()
      };
      this.model.save(data);
      console.log(this.model);
      return false;
      e.preventDefault();
      return e.stopPropagation();
    };
    return InvoiceForm;
  })();
  window.App = (function() {
    __extends(App, Backbone.Router);
    function App() {
      App.__super__.constructor.apply(this, arguments);
    }
    App.prototype.routes = {
      "": "home",
      "list": "list"
    };
    App.prototype.initialize = function() {
      return this.invoiceFormView = new InvoiceForm({
        model: new Invoice
      });
    };
    App.prototype.home = function() {
      return $('#app-container').html(this.invoiceFormView.render().el);
    };
    App.prototype.list = function() {
      return $('#app-container').html("listing");
    };
    return App;
  })();
  $(document).ready(function() {
    window.app = new App;
    return Backbone.history.start();
  });
}).call(this);
