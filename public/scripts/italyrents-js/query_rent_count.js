var selectedPropertyTypes;

// function hideChart()
// {
//     $('#chart').hide();
// }

function showChart(data)
{
    // console.log(selectedPropertyTypes);
    var colors = ['rgb(76, 132, 255)', 'rgb(204, 0, 255)', 'rgb(254, 196, 0)', 'rgb(41, 204, 151)', 'rgb(150, 0, 47)',
    'rgb(153, 153, 102)', 'rgb(0, 153, 51)'];
    
    var cities = [];
    console.log(data);
    for (item of data)
    {
        if (item != null)
        {
            cities.push(item[0]['city_name']);
        }
    }

    if (data.length == 1 && data[0][0]['neighbourhood'] != 'All')
    {
        cities[0] = data[0][0]['neighbourhood'] + ' (' + cities[0] + ')';
    }
    // console.log(cities);

    // var max_value = 0;
    var datasets = [];
    var k = 0;
    for (var i = 0; i < cities.length; i++)
    {
        var cityObj = {};
        cityObj['label'] = cities[i];
        cityObj['data'] = [];
        for (pType of selectedPropertyTypes)
        {
            var found = false;
            var j = 1;
            while (data[k] == null)
            {
                k++;
            }
            while (!found && j < data[k].length)
            {
                if(data[k][j]['_id'] == pType)
                {  
                    // var value = data[i][j]['count'];
                    // if (value >= max_value)
                    // {
                    //     max_value = value;
                    // }
                    // cityObj['data'].push(value);
                    cityObj['data'].push(data[k][j]['count']);
                    found = true;
                }
                j++;
            }
            if (!found)
            {
                cityObj['data'].push(0);
            }
        }
        cityObj['backgroundColor'] = colors[i];
        cityObj['borderColor'] = colors[i].substr(0, colors[i] - 1) + ',0)';
        cityObj['pointBackgroundColor'] = colors[i].substr(0, colors[i] - 1) + ',0)';
        cityObj['pointHoverBackgroundColor'] = colors[i].substr(0, colors[i] - 1) + ',1)';
        cityObj['pointHoverRadius'] = 3;
        cityObj['pointHitRadius'] = 30;

        datasets.push(cityObj);
        k++;
    }
    // console.log(datasets);
    // console.log(max_value);

    var acquisition3 = document.getElementById("bar3");
    if (acquisition3 !== null)
    {
        var acChart3 = new Chart(acquisition3, {
            type: "bar",
            data: {
                labels: selectedPropertyTypes,
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
                                // stepSize: 500,
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
        // $('#chart').show();
    }
}

function getData(request)
{
    $.ajax({
        method: 'POST',
        url: '/ItalyRents/rentCountQuery',
        data: request,
        dataType: 'json'
    })
    .done(function(data){
        // console.log(data);

        var chart = `<div class="col-12" id="chart">
            <div class="card card-default pb-5">
                <div class="card-header justify-content-center">
                    <h2 class="text-center">Count</h2>
                </div>
                <div class="card-body" style="height: 850px;">
                    <canvas id="bar3"></canvas>
                    <div id='customLegend' class='customLegend'></div>
                </div>
            </div>
        </div>`
        $('#chart').remove();
        $('.row').append(chart);

        showChart(data);
        stopLoader();
    })
}

function retrievalData()
{
    // hideChart();
    startLoader();

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

    selectedPropertyTypes = [];
    var propertyTypes = '';
    var allTypes = document.getElementById('propertyTypes').getElementsByTagName('input');
    //console.log(Object.values(allTypes));
    Object.values(allTypes).forEach(type => {
        if (type.checked)
        {
            propertyTypes = propertyTypes + type.name + ',';
            selectedPropertyTypes.push(type.name);
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

    var propNames = ['bathrooms', 'bedrooms', 'beds', 'squareMetres'];
    var regex = /[^0-9]/g;
    propNames.forEach(propName => {
        var values = document.getElementById(propName + 'Slider').noUiSlider.get();
        var strValues = values[0].toString().replace(regex, '') + ',' + values[1].toString().replace(regex, '');
        request[propName] = strValues;
    })

    //console.log(request);
    getData(request);
}