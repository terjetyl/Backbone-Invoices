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