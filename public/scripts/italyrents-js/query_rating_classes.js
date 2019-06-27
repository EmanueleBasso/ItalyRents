var selectedRatingType;
var selectedCity;
var selectedPropertyTypes;
var ratingClasses = [2, 3, 4, 5, 6, 7, 8, 9, 10];

var propertyColors = ['table-primary', 'table-secondary', 'table-success', 'table-danger', 'table-warning', 'table-info', 'table-light', 'table-active']

function putDataInTheRow(type, rowCount, rowPrice, rowData)
{
    var propertyTypeIndex = 0;
    if (type == 'city')
    {
        var j = 1;
    }
    else
    {
        var j = 0;
    }

    while (j < rowData.length)
    {
        if (selectedPropertyTypes[propertyTypeIndex] != rowData[j].propertyType)
        {
            ratingClasses.forEach(e => {
                rowCount.append('<td>0</td>');
                rowPrice.append('<td>0&euro;</td>');
            });
            propertyTypeIndex++;
        }
        else
        {
            var classes = rowData[j].ratings;
            var ratingClassIndex = 0;
            var k = 0;
            while (k < classes.length)
            {
                if (ratingClasses[ratingClassIndex] != classes[k].ratingClass)
                {
                    rowCount.append('<td>0</td>');
                    rowPrice.append('<td>0&euro;</td>');
                    ratingClassIndex++;
                }
                else
                {
                    rowCount.append('<td>' + classes[k].count + '</td>');
                    rowPrice.append('<td>' + classes[k].price + '&euro;</td>');
                    ratingClassIndex++;
                    k++;
                }
            }
            if (ratingClassIndex != ratingClasses.length)
            {
                while(ratingClassIndex < ratingClasses.length)
                {
                    rowCount.append('<td>0</td>');
                    rowPrice.append('<td>0&euro;</td>');
                    ratingClassIndex ++;
                }
            }
            propertyTypeIndex++;
            j++;
        }
    }
    if (propertyTypeIndex != selectedPropertyTypes.length)
    {
        for (var i = propertyTypeIndex; i < selectedPropertyTypes.length; i++)
        {
            for (var j = 0; j < ratingClasses.length; j++)
            {
                rowCount.append('<td>0</td>');
                rowPrice.append('<td>0&euro;</td>');

            }
        }
    }
    return [rowCount, rowPrice];
}

function showTable(data)
{
    $('#selectedRatingType').html(selectedRatingType.substring(0, 1).toUpperCase() + selectedRatingType.substring(1));
    var thead = $('#thead');
    var hFirstRow = $('<tr></tr>');
    var hSecondRow = $('<tr></tr>');
    var colorIndex = 0;
    selectedPropertyTypes.forEach(pType => {
        var pCell = $('<th colspan="9" class="' + propertyColors[colorIndex] + '">' + pType + '</th>');
        hFirstRow.append(pCell);
        for (var i = 2; i < 11; i++)
        {
            var rCell = $('<th class="' + propertyColors[colorIndex] + '">' + i + '</th>');
            hSecondRow.append(rCell);
        }
        colorIndex++;
    });
    thead.append(hFirstRow);  
    thead.append(hSecondRow);

    var tbody = $('#tbody');
    if (selectedCity == 'All')
    {
        hFirstRow.prepend('<th rowspan="2" class="second-col">Data</th>');
        hFirstRow.prepend('<th rowspan="2" class="first-col">City</th>');
        var cities = [];
        for (item of data)
        {
            if (item != null)
            {
                cities.push(item[0]['city_name']);
            }
        }

        var i = 0;
        for (city of cities)
        {
            var cityCountRow = $('<tr></tr>');
            cityCountRow.append('<td rowspan="2" class="first-col">' + city + '</td>');
            cityCountRow.append('<td class="second-col">Count</td>');
            var cityPriceRow = $('<tr></tr>');
            cityPriceRow.append('<td class="second-col">Avg Price</td>');
            while (data[i] == null)
            {
                i++;
            }
            cityData = data[i];
            var dataRows = putDataInTheRow('city', cityCountRow, cityPriceRow, cityData);
            for (var dataRow of dataRows)
            {
                tbody.append(dataRow);
            }
            i++;
        }
    }
    else
    {
        hFirstRow.prepend('<th rowspan="2" class="second-col">Data</th>');
        hFirstRow.prepend('<th rowspan="2" class="first-col">' + selectedCity + '</th>');
        if (data[0] != null)
        {
            for (neighbourhood of data[0])
            {
                var neighbourhoodCountRow = $('<tr></tr>');
                neighbourhoodCountRow.append('<td rowspan="2" class="first-col">' + neighbourhood._id + '</td>');
                neighbourhoodCountRow.append('<td class="second-col">Count</td>');
                var neighbourhoodPriceRow = $('<tr></tr>');
                neighbourhoodPriceRow.append('<td class="second-col">Avg Price</td>');
                var neighbourhoodData = neighbourhood.values;
                var dataRows = putDataInTheRow('neighbourhood', neighbourhoodCountRow, neighbourhoodPriceRow, neighbourhoodData);
                for (var dataRow of dataRows)
                {
                    tbody.append(dataRow);
                }
                i++;
            }
        }
    }
}

function getData(request)
{
    $.ajax({
        method: 'POST',
        url: '/ItalyRents/ratingClassesQuery',
        data: request,
        dataType: 'json'
    })
    .done(function(data){
        var table = `<div class="col-12" id="tableContainer">
            <div class="card card-default pb-5">
                <div class="card-header justify-content-center">
                    <h2 class="text-center" id="selectedRatingType"></h2>
                </div>
            <div class="card-body">
                <table id="table" class="table table-bordered table-striped">
                    <thead id="thead">
                    </thead>
                    <tbody id="tbody">
                    </tbody>
                </table>
            </div>`
        $('#tableContainer').remove();
        $('.row').append(table);

        showTable(data);
        fixSecondCol();
        stopLoader();
    })
}

function retrievalData()
{
    startLoader();

    var request = {}

    var city = $('#selectCities').val();
    request['city'] = city;
    selectedCity = city;

    selectedPropertyTypes = [];
    var propertyTypes = '';
    var allTypes = document.getElementById('propertyTypes').getElementsByTagName('input');
    Object.values(allTypes).forEach(type => {
        if (type.checked)
        {
            propertyTypes = propertyTypes + type.name + ',';
            selectedPropertyTypes.push(type.name);
        }
    });
    request['propertyTypes'] = propertyTypes.substring(0, propertyTypes.length - 1);

    var amenities = '';
    var allAmenities = document.getElementById('amenities').getElementsByTagName('input');
    Object.values(allAmenities).forEach(amenity => {
        if (amenity.checked)
        {
            amenities = amenities + amenity.name + ',';
        }
    });
    request['amenities'] = amenities.substring(0, amenities.length - 1);

    var ratingTypes = document.getElementsByName('rating');
    var i = 0;
    var found = false;
    while (!found && i < ratingTypes.length)
    {
        if (ratingTypes[i].checked)
        {
            request['rating'] = ratingTypes[i].value;
            selectedRatingType = ratingTypes[i].value;
            found = true;
        }
        i++;
    }

    getData(request);
}