function retrievalData(){
    var request = {}

    var city = $('#queryOptions #selectCities option:selected').prop('value')
    request['city'] = city

    var neighbourhood = ''
    if($('#queryOptions #selectNeighbourhoods').prop('disabled') == true){
        neighbourhood = 'All'
    }else{
        neighbourhood = $('#queryOptions #selectNeighbourhoods option:selected').prop('value')
    }
    request['neighbourhood'] = neighbourhood

    var amenities = ''
    $('#queryOptions #amenities label input').each( function(index, element) {
        if($(element).prop('checked'))
            amenities = amenities + $(element).attr('name') + ','
    })
    request['amenities'] = amenities.substring(0, amenities.length - 1)
    
    var propertyTypes = ''
    $('#queryOptions #propertyTypes label input').each( function(index, element) {
        if($(element).prop('checked'))
            propertyTypes = propertyTypes + $(element).attr('name') + ','
    })
    request['propertyTypes'] = propertyTypes.substring(0, propertyTypes.length - 1)
    
    var ratings = ''
    $('#queryOptions #ratingsToShow label input').each( function(index, element) {
        if($(element).prop('checked'))
            ratings = ratings + $(element).attr('name') + ','
    })
    request['ratings'] = ratings.substring(0, ratings.length - 1)

    var rating_type = $('#queryOptions #ratingTypeContainer option:selected').prop('value')
    request['rating_type'] = rating_type





    // Rotellina che gira sul video
    $.ajax({
        method: 'POST',
        url: '/ItalyRents/ratingAnalyzerQuery',
        data: request,
        dataType: 'json'
    })
    .done(function( data ) {
        console.log(data)
        // Mostrare i dati
    });
}