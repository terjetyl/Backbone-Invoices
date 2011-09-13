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
  window.Invoices = (function() {
    __extends(Invoices, Backbone.Collection);
    function Invoices() {
      Invoices.__super__.constructor.apply(this, arguments);
    }
    Invoices.prototype.model = Invoice;
    Invoices.prototype.localStorage = new Store("invoices");
    return Invoices;
  })();
  window.Invoices = new Invoices;
  window.InvoiceIndex = (function() {
    __extends(InvoiceIndex, Backbone.View);
    function InvoiceIndex() {
      InvoiceIndex.__super__.constructor.apply(this, arguments);
    }
    InvoiceIndex.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.template = _.template($('#invoice-list-template').html());
    };
    InvoiceIndex.prototype.render = function() {
      var rendered_content;
      rendered_content = this.template({
        collection: this.collection
      });
      $(this.el).html(rendered_content);
      $('#app-container').html($(this.el));
      return this;
    };
    return InvoiceIndex;
  })();
  window.InvoiceForm = (function() {
    __extends(InvoiceForm, Backbone.View);
    function InvoiceForm() {
      InvoiceForm.__super__.constructor.apply(this, arguments);
    }
    InvoiceForm.prototype.events = {
      "click button": "handleSubmit"
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
      $('#app-container').html($(this.el));
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
      if (this.model.isNew()) {
        Invoices.create(data);
      } else {
        this.model.save(data);
      }
      e.preventDefault();
      e.stopPropagation();
      return window.location.hash = "#";
    };
    return InvoiceForm;
  })();
  window.App = (function() {
    __extends(App, Backbone.Router);
    function App() {
      App.__super__.constructor.apply(this, arguments);
    }
    App.prototype.routes = {
      "": "index",
      "invoices/:id": "edit",
      "new": "newInvoice"
    };
    App.prototype.initialize = function() {};
    App.prototype.index = function() {
      this.invoiceIndex = new InvoiceIndex({
        collection: Invoices
      });
      return this.invoiceIndex.render();
    };
    App.prototype.newInvoice = function() {
      this.newInvoiceForm = new InvoiceForm({
        model: new Invoice
      });
      return this.newInvoiceForm.render();
    };
    App.prototype.edit = function(id) {
      var inv;
      inv = Invoices.getByCid(id);
      this.newInvoiceForm = new InvoiceForm({
        model: inv
      });
      return this.newInvoiceForm.render();
    };
    return App;
  })();
  $(document).ready(function() {
    window.app = new App;
    return Backbone.history.start();
  });
}).call(this);
