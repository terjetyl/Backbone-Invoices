describe "LineItem", ->
  beforeEach ->
    @f = new LineItem
  
  it "should have a default price of 100", ->
  	expect(@f.get('price')).toBe 100
  
  it "should have default value of 100 and quantity of 1", ->
    expect(@f.getTotalPrice()).toBe 100.00
  
  it "calculated total price from quantity and item price", ->
    @f.set({quantity: 15, price: 129.99})
    expect(@f.getTotalPrice().toFixed(2)).toBe '1949.85'
    

describe "Invoice", ->
  beforeEach ->
    @f = new Invoice({line_items: new LineItems(new LineItem)})
  
  it "sets the date to current date for newly created", ->
    d = new Date
    expect(@f.get('date').getMonth).toBe d.getMonth
    expect(@f.get('date').getDay).toBe d.getDay
    expect(@f.get('date').getFullYear).toBe d.getFullYear

  it "should provide formatted date while calling formattedDate()", ->
    @f2 = new Invoice({date:new Date('2011-09-03')})
    expect(@f2.get('date')).toBeDefined
    
  describe 'newly created line items array', ->  
    it "should be size of 1", ->
      expect(@f.get('line_items').length).toBe 1
    it "with the length of 1 should have item price = 100.00 and quantity = 1", ->
      expect(@f.get('line_items').at(0)).toBeDefined()  
      expect(@f.get('line_items').at(0).get('price')).toBeDefined()
      expect(@f.get('line_items').at(0).get('price')).toBe 100.00
      expect(@f.get('line_items').at(0).get('quantity')).toBe 1
      expect(@f.getTotalPrice()).toBe 100.00
  
  describe 'amount calculations', ->
    it "should return correct price from all assigned line items", ->
      @f.get('line_items').add new LineItem({quantity: 10, price: 120})
      @f.get('line_items').add new LineItem({quantity: 5, price: 19.99})
      expect(@f.getTotalPrice()).toBe 1399.95
      
describe "LineItemViewModel", ->
  beforeEach ->
    @f = new LineItemViewModel(new LineItem)
    
  it "should have a total of 100", ->
  	expect(@f.quantity()).toBe 1
  	expect(@f.price()).toBe 100
  	expect(@f.total()).toBe 100

describe "InvoiceViewModel", ->
  beforeEach ->
    @f = new InvoiceViewModel(new Invoice({line_items: new LineItems(new LineItem)}))
    console.log @f.formatted_name()
    console.log line for line in  @f.line_items()
    console.log line for line in @f.lines()
    
  it "should have a total of 100", ->
  	expect(@f.number()).toBe '000001'

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


