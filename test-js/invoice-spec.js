(function() {
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
    return it("should provide formatted date while calling formattedDate()", function() {
      this.f2 = new Invoice({
        date: new Date('2011-09-03')
      });
      return expect(this.f2.formattedDate()).toBe('03/09/2011');
    });
  });
}).call(this);
