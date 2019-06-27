const ratingAnalyzerQueryDB = require('../db/ratingAnalyzerQueryDB')

module.exports = async function (req, res){
    //console.log(req.body)

    var city_name = req.body.city
    var neighbourhood = req.body.neighbourhood
    var property_type = req.body.propertyTypes.split(',')
    var amenities = req.body.amenities.split(',')
    var ratings = req.body.ratings.split(',')
    var rating_type = req.body.rating_type

    ratingAnalyzerQueryDB(city_name, neighbourhood, property_type, amenities, ratings, rating_type, sendResponse, res)
}

function sendResponse(result, res){
    res.json(result)
}