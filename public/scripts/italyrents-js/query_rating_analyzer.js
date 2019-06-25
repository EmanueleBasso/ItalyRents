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

    startLoader()

    $.ajax({
        method: 'POST',
        url: '/ItalyRents/ratingAnalyzerQuery',
        data: request,
        dataType: 'json'
    })
    .done(function( data ) {
        //console.log(data)

        var graphic = `<div class="col-12" id="graphic">
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

        showChart(data)
                
        stopLoader()
    })
}

function showChart(data){
    var ratings_list = ["accuracy", "checkin", "cleanliness", "communication", "location"]
    var colors = ["rgb(76, 132, 255)", "rgb(204, 0, 255)", "rgb(254, 196, 0)", "rgb(41, 204, 151)", "rgb(150, 0, 47)"]

    var ratings = []
    var cities = []
    if(data[0] != null){
        for(prop in data[0]){
            for(r of ratings_list){
                if(r === prop){
                    ratings.push(r)
                }
            }
        }

        for(obj of data){
            cities.push(obj['city_name'])
        }
    }

    if((cities.length == 1) && data[0]['neighbourhood'] != 'All'){
        cities[0] = data[0]['neighbourhood'] + ' (' + cities[0] + ')'
    }

    var datasets = []
    var i = 0
    for(r of ratings){
        obj_data = {}
        obj_data['label'] = r

        obj_data['data'] = []
        for(obj of data){
            obj_data['data'].push(obj[r])
        }

        obj_data['backgroundColor'] = colors[i]
        obj_data['borderColor'] = colors[i].substr(0, colors[i] - 1) + ',0)'
        obj_data['pointBackgroundColor'] = colors[i].substr(0, colors[i] - 1) + ',0)'
        obj_data['pointHoverBackgroundColor'] = colors[i].substr(0, colors[i] - 1) + ',1)'
        obj_data['pointHoverRadius'] = 3
        obj_data['pointHitRadius'] = 30

        datasets.push(obj_data)
        
        i++
    }

    var acquisition3 = document.getElementById("bar3");
    if (acquisition3 !== null) {
    var acChart3 = new Chart(acquisition3, {
        type: "bar",
        data: {
        labels: cities,
        datasets: datasets
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [
            {
                gridLines: {
                display: false
                }
            }
            ],
            yAxes: [
            {
                gridLines: {
                display: true
                },
                ticks: {
                beginAtZero: false,
                stepSize: 1,
                fontColor: "#8a909d",
                fontFamily: "Roboto, sans-serif"
                }
            }
            ]
        },
        tooltips: {}
        }
    });
    document.getElementById("customLegend").innerHTML = acChart3.generateLegend();
    }
}