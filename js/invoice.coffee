# ------------------------------------------------------
# Models
# ------------------------------------------------------

class window.LineItem extends Backbone.Model
  
  
  initialize: ->

  defaults:
    quantity: 1
    price: 100.00
    description: null

class window.Invoice extends Backbone.Model
    
  initialize: ->
  
  defaults:
    date: new Date
    number: '000001'
    seller_info: null
    buyer_info: null  
    line_items: [new LineItem]
    
      
  formattedDate: ->
    $.format.date(@get('date').toString(), 'dd/MM/yyyy')


# ------------------------------------------------------
# Collections
# ------------------------------------------------------



class window.Invoices extends Backbone.Collection
  model: Invoice 
  localStorage: new Store("invoices")

window.Invoices = new Invoices
    
    
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
    "click #save-invoice" : "handleSubmit"
    "click #new-line-item" : "newRow"
  initialize:  ->
    _.bindAll(@, 'render')    
    @template = _.template($('#invoice-form-template').html())    
    
  render: ->
    rendered_content = @template({model: @model})  
    $(@.el).html(rendered_content)
   
      
    $('#app-container').html($(@.el))    
    for item in @model.get('line_items')
      view = new LineItemView({model: item})
      @$('#line-items').append(view.render().el)    
    @

  handleSubmit: (e) ->
    data = { 
      date : @$("input[name='date']").val(), 
      number : @$("input[name='number']").val(), 
      buyer_info : @$("textarea[name='buyer_info']").val(), 
      seller_info : @$("textarea[name='seller_info']").val()
    }
    if @model.isNew()
      Invoices.create(data)
    else
      @model.save(data)
    e.preventDefault()
    e.stopPropagation()    
    window.location.hash = "#"
    
  newRow: (e) ->
    view = new LineItemView({model: new LineItem})
    $('#line-items').append(view.render().el)    
    

    
  
    

class window.LineItemView extends Backbone.View
  tagName: "tr"
  #$el: $('#line-items');
  events: 
    "click .remove-line-item" : "removeRow"
    
  initialize:  ->
    _.bindAll(@, 'render')    
    @template = _.template($('#line-item-template').html())    

  render: ->
    rendered_content = @template({model: @model})  
    $(@.el).html(rendered_content)
    @
  removeRow: (e) ->
    @model.destroy()


# ------------------------------------------------------
# Routers
# ------------------------------------------------------
  
class window.App extends Backbone.Router
  routes :            
    "" : "index"
    "invoices/:id" : "edit"
    "new" : "newInvoice"

  initialize: ->
    
  index: ->  
    @invoiceIndex = new InvoiceIndex({collection: Invoices})
    @invoiceIndex.render()
  
  newInvoice: -> 
    @newInvoiceForm = new InvoiceForm({model: new Invoice})
    @newInvoiceForm.render()
  
  edit: (id) ->
    inv = Invoices.getByCid(id)
    @newInvoiceForm = new InvoiceForm({model: inv})
    @newInvoiceForm.render()
      
  
 
  
  
  
$(document).ready ->
  window.app = new App
  Backbone.history.start()
  