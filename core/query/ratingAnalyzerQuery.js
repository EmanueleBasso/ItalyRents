const logger = require('loglevel')
const ratingAnalyzerQueryDB = require('../db/ratingAnalyzerQueryDB')

module.exports = async function (req, res){
    var city_name = req.body.city
    var neighbourhood = req.body.neighbourhood
    var property_type = req.body.propertyTypes.split(',')
    var amenities = req.body.amenities.split(',')
    var ratings = req.body.ratings.split(',')
    var rating_type = req.body.rating_type

    console.log(req.body)

    ratingAnalyzerQueryDB(city_name, neighbourhood, property_type, amenities, ratings, rating_type, sendResponse, res)
}

function sendResponse(result, res){
    for(var obj of result){
        for(var prop in obj) {
            if(!isNaN(obj[prop]))
                obj[prop] = parseFloat((Math.round(((obj[prop] + 0.00001) * 100)) / 100).toFixed(2))
        }
    }

    res.json(result)
}