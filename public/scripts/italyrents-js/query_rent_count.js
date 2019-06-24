function retrievalData()
{
    var request = {}

    var city = $('#selectCities').val();
    request['city'] = city;

    var neighbourhoodsSelectBox = $('#selectNeighbourhoods');
    var neighbourhood = 'All';
    if (!neighbourhoodsSelectBox.prop('disabled'))
    {
        neighbourhood = neighbourhoodsSelectBox.val();
    }
    request['neighbourhood'] = neighbourhood;

    var propertyTypes = '';
    var allTypes = document.getElementById('propertyTypes').getElementsByTagName('input');
    //console.log(Object.values(allTypes));
    Object.values(allTypes).forEach(type => {
        if (type.checked)
        {
            propertyTypes = propertyTypes + type.name + ',';
        }
    });
    request['propertyTypes'] = propertyTypes.substring(0, propertyTypes.length - 1);
    //console.log(request['propertyTypes']);

    var amenities = '';
    var allAmenities = document.getElementById('amenities').getElementsByTagName('input');
    //console.log(Object.values(allTypes));
    Object.values(allAmenities).forEach(amenity => {
        if (amenity.checked)
        {
            amenities = amenities + amenity.name + ',';
        }
    });
    request['amenities'] = amenities.substring(0, amenities.length - 1);
    //console.log(request['amenities']);

    var propNames = ['bathrooms', 'bedrooms', 'beds', 'squareMetres'];
    var regex = /[^0-9]/g;
    propNames.forEach(propName => {
        var values = document.getElementById(propName + 'Slider').noUiSlider.get();
        var strValues = values[0].toString().replace(regex, '') + ',' + values[1].toString().replace(regex, '');
        request[propName] = strValues;
    })

    console.log(request);

    $.ajax({
        method: 'POST',
        url: '/ItalyRents/rentCountQuery',
        data: request,
        dataType: 'json'
    })
    .done(function(data){
        console.log(data)

     /*   var graphic = `<div class="col-12" id="graphic">
            <div class="card card-default pb-5">
                <div class="card-header justify-content-center">
                    <h2 class="text-center">Ratings</h2>
                </div>
                <div class="card-body" style="height: 600px;">
                    <canvas id="bar3"></canvas>
                    <div id='customLegend' class='customLegend'></div>
                </div>
            </div>
        </div>`

        $('#graphic').remove()
        $('.row').append(graphic)

        showGraphic(data)
                
        stopLoader()*/
    })
}