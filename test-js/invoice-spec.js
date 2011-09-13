(function() {
  var item, _i, _len;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  describe("Invoice", function() {
    beforeEach(function() {
      return this.f = new Invoice;
    });
    it("sets the date to current date for newly created", function() {
      var d;
      d = new Date;
      expect(this.f.get('date').getMonth).toBe(d.getMonth);
      expect(this.f.get('date').getDay).toBe(d.getDay);
      return expect(this.f.get('date').getFullYear).toBe(d.getFullYear);
    });
    it("should provide formatted date while calling formattedDate()", function() {
      this.f2 = new Invoice({
        date: new Date('2011-09-03')
      });
      return expect(this.f2.formattedDate()).toBe('03/09/2011');
    });
    return it("should have one default line item on createion", function() {
      return expect(this.f.get('line_items').length).toBe(1);
    });
  });
  window.InvoicesDouble = (function() {
    __extends(InvoicesDouble, Backbone.Collection);
    function InvoicesDouble() {
      InvoicesDouble.__super__.constructor.apply(this, arguments);
    }
    InvoicesDouble.prototype.model = Invoice;
    InvoicesDouble.prototype.localStorage = new Store("invoices-test");
    return InvoicesDouble;
  })();
  window.invoices_test = new InvoicesDouble;
  describe("Invoices", function() {
    it("should be empty at first", function() {
      return expect(invoices_test.length).toBe(0);
    });
    it("should save attributes successfully", function() {
      var attrs;
      attrs = {
        number: '000001'
      };
      invoices_test.create(attrs);
      return expect(invoices_test.length).toBe(1);
    });
    return it("should read attributes correctly from locastorage", function() {
      return expect(invoices_test.first().get('number')).toBe('000001');
    });
  });
  for (_i = 0, _len = invoices_test.length; _i < _len; _i++) {
    item = invoices_test[_i];
    item.destroy;
  }
}).call(this);
