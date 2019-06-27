const ratingClassesQueryDB = require('../db/ratingClassesQueryDB')

module.exports = async function (req, res)
{
    //console.log(req.body)
    
    var city_name = req.body.city
    var property_type = req.body.propertyTypes.split(',')
    var amenities = req.body.amenities.split(',')
    var rating = req.body.rating;

    ratingClassesQueryDB(city_name, property_type, amenities, rating, sendResponse, res)
}

function sendResponse(result, res)
{
    res.json(result)
}