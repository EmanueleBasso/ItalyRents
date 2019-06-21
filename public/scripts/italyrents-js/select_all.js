function toogleAmenities(checkBoxAll)
{
    var amenities = $('#amenities');
    if (checkBoxAll.checked == true)
    {
        amenities.find('input').prop("checked", true);
    }
    else
    {
        amenities.find('input').prop("checked", false);
    }
}

function tooglePropertyTypes(checkBoxAll)
{
    var propertyTypes = $('#propertyTypes');
    if (checkBoxAll.checked == true)
    {
        propertyTypes.find('input').prop("checked", true);
    }
    else
    {
        propertyTypes.find('input').prop("checked", false);
    }
}