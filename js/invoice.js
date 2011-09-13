(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.LineItem = (function() {
    __extends(LineItem, Backbone.Model);
    function LineItem() {
      LineItem.__super__.constructor.apply(this, arguments);
    }
    LineItem.prototype.tax_rates = {
      0: "0%",
      0.19: "19%",
      0.22: "22%",
      0.23: "23%"
    };
    LineItem.prototype.initialize = function() {
      var name, rate, _ref, _results;
      this.tax_rates_option_tag = "";
      _ref = this.tax_rates;
      _results = [];
      for (rate in _ref) {
        name = _ref[rate];
        _results.push(this.tax_rates_option_tag += '<option value="' + rate + '">' + name + '</option>');
      }
      return _results;
    };
    LineItem.prototype.getTaxRatesOptionTag = function() {
      return this.tax_rates_option_tag;
    };
    LineItem.prototype.getTotalPrice = function() {
      var total_price;
      total_price = this.get('price') * this.get('quantity');
      return total_price + total_price * this.get('tax_rate');
    };
    LineItem.prototype.defaults = {
      quantity: 1,
      price: 100.00,
      description: null,
      tax_rate: 0
    };
    return LineItem;
  })();
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
      buyer_info: null,
      line_items: [new LineItem]
    };
    Invoice.prototype.getTotalPrice = function() {
      var item, total, _i, _len, _ref;
      total = 0;
      _ref = this.get('line_items');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        total += item.getTotalPrice();
      }
      return total;
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
  window.invoices = new Invoices;
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
      "click .save-invoice": "handleSubmit",
      "click .new-line-item": "newRow"
    };
    InvoiceForm.prototype.initialize = function() {
      _.bindAll(this, 'render');
      return this.template = _.template($('#invoice-form-template').html());
    };
    InvoiceForm.prototype.render = function() {
      var item, rendered_content, view, _i, _len, _ref;
      rendered_content = this.template({
        model: this.model
      });
      $(this.el).html(rendered_content);
      $('#app-container').html($(this.el));
      _ref = this.model.get('line_items');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        view = new LineItemView({
          model: item
        });
        this.$('.line-items').append(view.render().el);
      }
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
        invoices.create(data);
      } else {
        this.model.save(data);
      }
      e.preventDefault();
      e.stopPropagation();
      return window.location.hash = "#";
    };
    InvoiceForm.prototype.newRow = function(e) {
      var view;
      view = new LineItemView({
        model: new LineItem
      });
      return this.$('.line-items').append(view.render().el);
    };
    return InvoiceForm;
  })();
  window.LineItemView = (function() {
    __extends(LineItemView, Backbone.View);
    function LineItemView() {
      LineItemView.__super__.constructor.apply(this, arguments);
    }
    LineItemView.prototype.tagName = "tr";
    LineItemView.prototype.events = {
      "click .remove-line-item": "removeRow",
      "change input": "fieldChanged",
      "change select": "selectionChanged"
    };
    LineItemView.prototype.initialize = function() {
      _.bindAll(this, 'render');
      this.template = _.template($('#line-item-template').html());
      return this.model.bind('change', this.render);
    };
    LineItemView.prototype.render = function() {
      var rendered_content;
      rendered_content = this.template({
        model: this.model
      });
      $(this.el).html(rendered_content);
      return this;
    };
    LineItemView.prototype.removeRow = function(e) {
      return $(this.el).fadeOut('slow', function() {
        return $(this.el).remove();
      });
    };
    LineItemView.prototype.fieldChanged = function(e) {
      var data, field;
      field = $(e.currentTarget);
      data = {};
      data[field.attr('name')] = field.val();
      return this.model.set(data);
    };
    LineItemView.prototype.selectionChanged = function(e) {
      var data, field, value;
      field = $(e.currentTarget);
      value = $("option:selected", field).val();
      data = {};
      data[field.attr('name')] = value;
      return this.model.set(data);
    };
    return LineItemView;
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
    App.prototype.initialize = function() {
      return this.invoiceIndex = new InvoiceIndex({
        collection: invoices
      });
    };
    App.prototype.index = function() {
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
      inv = invoices.getByCid(id);
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
