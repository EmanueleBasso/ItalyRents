const rentCountQueryDB = require('../db/rentCountQueryDB')

function parseRange(stringRange)
{
    var numRange = [];
    stringRange.forEach(element => {
        numRange.push(parseInt(element.trim()))
    });
    return numRange
}

module.exports = async function (req, res)
{
    //console.log(req.body)
    var city_name = req.body.city
    var neighbourhood = req.body.neighbourhood
    var property_type = req.body.propertyTypes.split(',')
    var amenities = req.body.amenities.split(',')
    var bathrooms_range = parseRange(req.body.bathrooms.split(','))
    var bedrooms_range = parseRange(req.body.bedrooms.split(','))
    var beds_range = parseRange(req.body.beds.split(','))
    var square_metres_range = parseRange(req.body.squareMetres.split(','))

    rentCountQueryDB(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range, sendResponse, res)
}

function sendResponse(result, res)
{
    res.json(result)
}