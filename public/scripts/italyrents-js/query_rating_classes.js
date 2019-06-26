var selectedRatingType;
var selectedCity;
var selectedPropertyTypes;
var ratingClasses = [2, 3, 4, 5, 6, 7, 8, 9, 10];

var propertyColors = ['table-primary', 'table-secondary', 'table-success', 'table-danger', 'table-warning', 'table-info', 'table-light', 'table-active']

function putDataInTheRow(type, row, rowData)
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
                row.append('<td>0</td>');
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
                    row.append('<td>0</td>');
                    ratingClassIndex++;
                }
                else
                {
                    row.append('<td>' + classes[k].count + '</td>');
                    ratingClassIndex++;
                    k++;
                }
            }
            if (ratingClassIndex != ratingClasses.length)
            {
                while(ratingClassIndex < ratingClasses.length)
                {
                    row.append('<td>0</td>');
                    ratingClassIndex ++;
                }
            }
            propertyTypeIndex++;
            j++;
        }
    }
    console.log(propertyTypeIndex, selectedPropertyTypes.length);
    if (propertyTypeIndex != selectedPropertyTypes.length)
    {
        for (var i = propertyTypeIndex; i < selectedPropertyTypes.length; i++)
        {
            for (var j = 0; j < ratingClasses.length; j++)
            {
                row.append('<td>0</td>');
            }
        }
    }
    return row;
}

function showTable(data)
{
    // console.log(selectedCity);
    // console.log(selectedPropertyTypes);
    // console.log(data);

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
            var cityRow = $('<tr></tr>');
            cityRow.append('<td class="first-col">' + city + '</td>');
            while (data[i] == null)
            {
                i++;
            }
            cityData = data[i];
            cityRow = putDataInTheRow('city', cityRow, cityData);
            tbody.append(cityRow);
            i++;
        }
    }
    else
    {
        hFirstRow.prepend('<th rowspan="2" class="first-col">Neighbourhood</th>');
        if (data[0] != null)
        {
            for (neighbourhood of data[0])
            {
                var neighbourhoodRow = $('<tr></tr>');
                neighbourhoodRow.append('<td class="first-col">' + neighbourhood._id + '</td>');
                var neighbourhoodData = neighbourhood.values;
                neighbourhoodRow = putDataInTheRow('neighbourhood', neighbourhoodRow, neighbourhoodData);
                tbody.append(neighbourhoodRow);
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

    console.log(request);

    getData(request);
}