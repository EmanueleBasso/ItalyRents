function retrievalData(){
    var request = {}

    var amenity = $('#amenity_combo option:selected').prop('value')
    request['amenity'] = amenity

    var property = $('#property_combo option:selected').prop('value')
    request['property'] = property

    var price = $('#price_combo option:selected').prop('value')
    request['price'] = price

    var rating = $('#rating_combo option:selected').prop('value')
    request['rating'] = rating

    var mq = $('#mq_combo option:selected').prop('value')
    request['mq'] = mq

    startLoader()

    $.ajax({
        method: 'POST',
        url: '/ItalyRents/amenityAndPropertyQuery',
        data: request,
        dataType: 'json'
    })
    .done(function( data ) {
        //console.log(data)

        showData(data)
                
        stopLoader()
    })
}

function showData(data){
    $('#result_price').text(data['price'])
    $('#result_rating').text(data['rating'])
    $('#result_mq').text(data['mq'])
}