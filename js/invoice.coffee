class window.Invoice extends Backbone.Model
    
  initialize: ->
  
  defaults:
    date: new Date
    number: '000001'
    seller_info: null
    buyer_info: null
  
  formattedDate: ->
    $.format.date(@get('date').toString(), 'dd/MM/yyyy')
  

class window.InvoiceView extends Backbone.View



class window.Invoices extends Backbone.Collection
  model: Invoice 
  localStorage: new window.Store("invoices")

window.invoices = new Invoices

class window.InvoiceForm extends Backbone.View
    
  events: 
    "submit form" : "handleSubmit"
  
    
  initialize:  ->

    _.bindAll(@, 'render')    
    @template = _.template($('#invoice-form-template').html())
    
  render: ->
    
    rendered_content = @template({model: @model})  
    $(@el).html(rendered_content)      
    @

  handleSubmit: (e) ->
    data = { 
      date : @$("input[name='date']").val(), 
      number : @$("input[name='number']").val(), 
      buyer_info : @$("textarea[name='buyer_info']").val(), 
      seller_info : @$("textarea[name='seller_info']").val()
    }
    @model.save(data)
    console.log(@model)
    return false 
    e.preventDefault()
    e.stopPropagation()    
    
  
class window.App extends Backbone.Router
  routes :            
    "" : "home"
    "list" : "list"
  
  initialize: ->
    @invoiceFormView = new InvoiceForm({model: new Invoice})
    
  home: ->  
    $('#app-container').html(@invoiceFormView.render().el)
  
  list: ->  
    $('#app-container').html("listing")
  
  
  
  
$(document).ready ->
  window.app = new App
  Backbone.history.start()
  