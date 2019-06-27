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
   
    var propertyTypes = ''
    $('#queryOptions #propertyTypes label input').each( function(index, element) {
        if($(element).prop('checked'))
            propertyTypes = propertyTypes + $(element).attr('name') + ','
    })
    request['propertyTypes'] = propertyTypes.substring(0, propertyTypes.length - 1)
    
    var propNames = ['bathrooms', 'bedrooms', 'beds', 'price']
    var regex = /[^0-9]/g;
    propNames.forEach(propName => {
        var values = document.getElementById(propName + 'Slider').noUiSlider.get()
        var strValues = values[0].toString().replace(regex, '') + ',' + values[1].toString().replace(regex, '')
        request[propName] = strValues
    })

    startLoader()

    $.ajax({
        method: 'POST',
        url: '/ItalyRents/squareMetresClassesQuery',
        data: request,
        dataType: 'json'
    })
    .done(function(data) {
        var graphic = `<div class="col-12" id="graphic">
            <div class="card card-default pb-5">
                <div class="card-header justify-content-center">
                    <h2 class="text-center">Square Metres Number</h2>
                </div>
                <div class="card-body" style="height: 600px;">
                    <p id="legend_bottom_pie" style="text-align: center; color: black;"></p>
                    <br/>
                    <canvas id="pieChart"></canvas>
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
    var colors = ['rgb(76, 20, 255)', 'rgb(150, 0, 100)', 'rgb(254, 4, 104)', 'rgb(41, 150, 151)', 'rgb(150, 80, 47)']
    var labels = ['30 - 80 mq', '80 - 130 mq', '130 - 180 mq', '180 - 230 mq', '230 - 280 mq']

    var legend_bottom_pie = document.getElementById('legend_bottom_pie')
    if((data['neighbourhood'] != null) && (data['neighbourhood'] != 'All'))
        legend_bottom_pie.innerHTML = data['neighbourhood'] + ' (' + data['city'] + ')'
    else
        legend_bottom_pie.innerHTML = data['city']

    var dataset = []
    dataset.push(data[labels[0].substr(0, labels[0].length - 3)])
    dataset.push(data[labels[1].substr(0, labels[1].length - 3)])
    dataset.push(data[labels[2].substr(0, labels[2].length - 3)])
    dataset.push(data[labels[3].substr(0, labels[3].length - 3)])
    dataset.push(data[labels[4].substr(0, labels[4].length - 3)])

    var acquisition3 = document.getElementById('pieChart');
    if (acquisition3 !== null) {
        var acChart3 = new Chart(acquisition3, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [
                {
                    label: labels,
                    data: dataset,
                    backgroundColor: colors,
                    borderWidth: 1
                }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'bottom'
                },
                cutoutPercentage: 0,
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) {
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: function(tooltipItem, data) {
                            return data['datasets'][0]['data'][tooltipItem['index']];
                        }
                    },
                    titleFontColor: '#888',
                    bodyFontColor: '#555',
                    titleFontSize: 12,
                    bodyFontSize: 15,
                    backgroundColor: 'rgba(256,256,256,0.95)',
                    displayColors: true,
                    xPadding: 10,
                    yPadding: 7,
                    borderColor: 'rgba(220, 220, 220, 0.9)',
                    borderWidth: 2,
                    caretSize: 6,
                    caretPadding: 5
                }
            }
        })
    }
}