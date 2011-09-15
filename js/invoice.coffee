_.extend Backbone.Model::, deepToJSON: ->
  obj = @toJSON()
  _.each _.keys(obj), (key) ->
    obj[key] = obj[key].deepToJSON()  if _.isFunction(obj[key].deepToJSON)
  
  obj

_.extend Backbone.Collection::, deepToJSON: ->
  @map (model) ->
    model.deepToJSON()

# ------------------------------------------------------
# Models
# ------------------------------------------------------

class window.LineItem extends Backbone.Model
  tax_rates:
    0: "0%"
    0.19: "19%"
    0.22: "22%"
    0.23: "23%"
      
  initialize: ->
    @tax_rates_option_tag = ""    
    @tax_rates_option_tag += '<option value="' + rate + '">' + name + '</option>' for rate, name of @tax_rates     
  

  
  getTaxRatesOptionTag: ->
    @tax_rates_option_tag
  
  getTotalPrice: ->
    total_price = @get('price') * @get('quantity')
    total_price + total_price * @get('tax_rate')
        
  defaults:
    quantity: 1
    price: 100.00
    description: null
    tax_rate: 0

class window.LineItems extends Backbone.Collection
  model: LineItem


class window.Invoice extends Backbone.Model
    
  initialize: ->
    @line_items = new LineItems
    
  defaults:
    date: new Date
    number: '000001'
    seller_info: null
    buyer_info: null  
  
  getTotalPrice: ->
    total = 0
    for item in @get('line_items')
      i = new LineItem(item)
      total += i.getTotalPrice()
    @numberFormat(total, 2)  
  
  formattedDate: ->
    $.format.date(@get('date').toString(), 'dd/MM/yyyy')

  numberFormat: (number, decimals, dec_point, thousands_sep) ->
    n = (if not isFinite(+number) then 0 else +number)
    prec = (if not isFinite(+decimals) then 0 else Math.abs(decimals))
    sep = (if (typeof thousands_sep == "undefined") then "." else thousands_sep)
    dec = (if (typeof dec_point == "undefined") then "," else dec_point)
    s = ""
    toFixedFix = (n, prec) ->
      k = Math.pow(10, prec)
      "" + Math.round(n * k) / k

    s = (if prec then toFixedFix(n, prec) else "" + Math.round(n)).split(".")
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)  if s[0].length > 3
    if (s[1] or "").length < prec
      s[1] = s[1] or ""
      s[1] += new Array(prec - s[1].length + 1).join("0")
    s.join dec

# ------------------------------------------------------
# Collections
# ------------------------------------------------------



class window.Invoices extends Backbone.Collection
  model: Invoice 
  localStorage: new Store("invoices")

window.invoices = new Invoices
    
    
# ------------------------------------------------------
# Views
# ------------------------------------------------------    
    
class window.InvoiceIndex extends Backbone.View
  initialize:  ->
    _.bindAll(@, 'render')    
    @template = _.template($('#invoice-list-template').html())    

  render: ->
    rendered_content = @template({collection: @collection})  
    $(@.el).html(rendered_content)
    $('#app-container').html($(@.el))
    @  


class window.InvoiceForm extends Backbone.View
  events: 
    "click .save-invoice" : "handleSubmit"
    "click .new-line-item" : "newRow"

  initialize: ->
    _.bindAll(@, 'render')    
    @template = _.template($('#invoice-form-template').html())    
    
    
  render: ->
    rendered_content = @template({model: @model})  
    $(@.el).html rendered_content
   
      
    $('#app-container').html($(@.el))    
    
    if @model.get('line_items')
      collection = @model.get('line_items')
    else 
      collection = @model.line_items
    
    for item in collection
      i = new LineItem(item)
      view = new LineItemView({model: i})
      @$('.line-items').append view.render().el    
    @

  handleSubmit: (e) ->
        
    data = { 
      date : @$("input[name='date']").val(), 
      number : @$("input[name='number']").val(), 
      buyer_info : @$("textarea[name='buyer_info']").val(), 
      seller_info : @$("textarea[name='seller_info']").val(),
      line_items: collection.toJSON()
    }    
    if @model.isNew()
      invoices.create(data)
    else
      @model.save(data)
    e.preventDefault()
    e.stopPropagation()    
    window.location.hash = "#"
    
  newRow: (e) ->
    item = new LineItem
    @model.line_items.add(item)
    view = new LineItemView({model: item})
    console.log(@model)
    @$('.line-items').append(view.render().el)
    e.preventDefault()

    
      
class window.LineItemView extends Backbone.View
  tagName: "tr"
  events: 
    "click .remove-line-item" : "removeRow"
    "change input": "fieldChanged"
    "change select": "selectionChanged"
    
  initialize:  ->
    _.bindAll @, 'render'
    @template = _.template $('#line-item-template').html()
    @model.bind 'change', @render
    
  render: ->    
    rendered_content = @template({model: @model})  
    $(@.el).html rendered_content
    @
    
  removeRow: (e) ->
    $(@.el).fadeOut 'slow', ->
      $(@el).remove()   
    e.preventDefault()

  
  fieldChanged: (e) ->
    field = $(e.currentTarget);
    data = {}
    data[field.attr('name')] = field.val()
    @model.set(data)
    
  selectionChanged: (e) ->
    field = $(e.currentTarget)        
    value = $("option:selected", field).val()
    data = {}
    data[field.attr('name')] = value
    @model.set(data)


# ------------------------------------------------------
# Routers
# ------------------------------------------------------
  
class window.App extends Backbone.Router
  routes :            
    "" : "index"
    "invoices/:id" : "edit"
    "new" : "newInvoice"

  initialize: ->
    @invoiceIndex = new InvoiceIndex({collection: invoices})
    
  index: ->      
    @clearMenuActiveClass()
    @invoiceIndex.render()
    $('#list-invoices-menu-item').addClass 'active'
  
  newInvoice: -> 
    @clearMenuActiveClass()
    newInvoiceForm = new InvoiceForm({model: new Invoice})  
    newInvoiceForm.render()
    $('#new-invoice-menu-item').addClass 'active'
  
  edit: (id) ->
    inv = invoices.getByCid(id)
    @newInvoiceForm = new InvoiceForm({model: inv})
    @newInvoiceForm.render()
  
  clearMenuActiveClass: ->
    $(li).removeClass('active') for li in $('#navigation ul li')

  

$(document).ready ->
  window.app = new App
  Backbone.history.start()
  
