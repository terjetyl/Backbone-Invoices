describe "LineItem", ->
  beforeEach ->
    @f = new LineItem
  
  it "shoudl have default value of 100 and quantity of 1", ->
    expect(@f.getTotalPrice()).toBe 100.00  
  
  it "calculated total price from quantity and item price", ->
    @f.set({quantity: 15, price: 129.99})
    expect(@f.getTotalPrice()).toBe 1949.85  
    

describe "Invoice", ->
  beforeEach ->
    @f = new Invoice
  
  it "sets the date to current date for newly created", ->
    d = new Date
    expect(@f.get('date').getMonth).toBe d.getMonth
    expect(@f.get('date').getDay).toBe d.getDay
    expect(@f.get('date').getFullYear).toBe d.getFullYear

  it "should provide formatted date while calling formattedDate()", ->
    @f2 = new Invoice({date:new Date('2011-09-03')})
    expect(@f2.formattedDate()).toBe '03/09/2011'
    
  describe 'newly created line items array', ->  
    it "should be size of 1", ->
      expect(@f.get('line_items').length).toBe 1  
    it "with the length of 1 should have item price = 100.00 and quantity = 1", ->
      expect(@f.get('line_items')[0].get('price')).toBe 100.00
      expect(@f.get('line_items')[0].get('quantity')).toBe 1
  
  describe 'amount calculations', ->
    it "should return correct price from all assigned line items", ->
      items = [
        new LineItem({quantity: 10, price: 120})
        new LineItem({quantity: 5, price: 19.99})
      ]
      @f.set({line_items: items})
      expect(@f.getTotalPrice()).toBe 1299.95

class window.InvoicesDouble extends Invoices
  localStorage: new Store("invoices-test")

window.invoices_test = new InvoicesDouble

  
describe "Invoices", ->    
  
  it "should be empty at first", ->
    expect(invoices_test.length).toBe 0
    
  it "should save attributes successfully", ->
    attrs = {
      number : '000001'    
    }
    invoices_test.create(attrs)
    expect(invoices_test.length).toBe 1
  
  it "should read attributes correctly from locastorage", ->
    expect(invoices_test.first().get('number')).toBe '000001' 
    
for item in invoices_test
    item.destroy


