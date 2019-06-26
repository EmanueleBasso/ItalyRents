function getData(request)
{
    $.ajax({
        method: 'POST',
        url: '/ItalyRents/ratingClassesQuery',
        data: request,
        dataType: 'json'
    })
    .done(function(data){
        console.log(data);

        // var chart = `<div class="col-12" id="chart">
        //     <div class="card card-default pb-5">
        //         <div class="card-header justify-content-center">
        //             <h2 class="text-center">Count</h2>
        //         </div>
        //         <div class="card-body" style="height: 850px;">
        //             <canvas id="bar3"></canvas>
        //             <div id='customLegend' class='customLegend'></div>
        //         </div>
        //     </div>
        // </div>`
        // $('#chart').remove();
        // $('.row').append(chart);

        // showChart(data);
        // stopLoader();
    })
}

function retrievalData()
{
    // startLoader();

    var request = {}

    var city = $('#selectCities').val();
    request['city'] = city;

    // selectedPropertyTypes = [];
    var propertyTypes = '';
    var allTypes = document.getElementById('propertyTypes').getElementsByTagName('input');
    //console.log(Object.values(allTypes));
    Object.values(allTypes).forEach(type => {
        if (type.checked)
        {
            propertyTypes = propertyTypes + type.name + ',';
            // selectedPropertyTypes.push(type.name);
        }
    });
    request['propertyTypes'] = propertyTypes.substring(0, propertyTypes.length - 1);
    //console.log(request['propertyTypes']);

    var amenities = '';
    var allAmenities = document.getElementById('amenities').getElementsByTagName('input');
    Object.values(allAmenities).forEach(amenity => {
        if (amenity.checked)
        {
            amenities = amenities + amenity.name + ',';
        }
    });
    request['amenities'] = amenities.substring(0, amenities.length - 1);
    //console.log(request['amenities']);

    var ratingTypes = document.getElementsByName('rating');
    var i = 0;
    var found = false;
    while (!found && i < ratingTypes.length)
    {
        if (ratingTypes[i].checked)
        {
            request['rating'] = ratingTypes[i].value;
            found = true;
        }
        i++;
    }

    console.log(request);
    getData(request);
}