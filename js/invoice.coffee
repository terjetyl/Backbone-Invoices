class window.Invoice extends Backbone.Model
  
  initialize: ->
  
  defaults:
    date: new Date
    number: 000001
    seller_info: null
    buyer_info: null
  
  formattedDate: ->
    $.format.date(@get('date').toString(), 'dd/MM/yyyy')
  
  
class window.InvoiceForm extends Backbone.View
    
  initialize:  ->

    _.bindAll(@, 'render')    
    @template = _.template($('#invoice-form-template').html())
    
  render: ->
    
    rendered_content = @template({model: @model})  
    $(@el).html(rendered_content)      
    @
  
  
