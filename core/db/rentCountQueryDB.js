const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range, sendResponse, res)
{
    if (city_name === 'All')
    {
        await Promise.all([
            query('Bergamo', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Bologna', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Firenze', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Milano', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Napoli', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Roma', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range),
            query('Venezia', neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range)
        ]).then(async (responses) =>  {
            sendResponse(responses, res)
        })
    }
    else
    {
        query(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range).then(async (response) => {
            sendResponse([response], res)
        })
    }

}

async function query(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_metres_range)
{
    return new Promise( (resolve, reject) => {
        (async () => {
            connection.db.collection('listings' + city_name, function(err, collection){
                if(err)
                    logger.error(err)
        
                var pipeline = []
        
                // Neighbourhood
                if(neighbourhood !== 'All')
                    pipeline.push({$match: {neighbourhood: neighbourhood}})
        
                // Property Type
                var p_type = {$match: {$or: []}}
                for (p of property_type){
                    var obj = {}
                    obj["property_type"] = p
                    
                    p_type['$match']['$or'].push(obj)
                }
                pipeline.push(p_type)
        
                // Amenities
                var a_type = {$match: {$or: []}}
                for(a of amenities){
                    var obj = {}
                    obj['amenities.' + a] = true
                    
                    a_type['$match']['$or'].push(obj)
                }
                pipeline.push(a_type)
        
                // Bathrooms
                var n_bathrooms = {$match: {$and: []}}
                // Min
                var inner_obj = {$gte: bathrooms_range[0]}
                var obj = {bathrooms: inner_obj}
                n_bathrooms['$match']['$and'].push(obj)
                // Max
                var inner_obj = {$lte: bathrooms_range[1]}
                var obj = {bathrooms: inner_obj}
                n_bathrooms['$match']['$and'].push(obj)
                pipeline.push(n_bathrooms)
                
                // Bedrooms
                var n_bedrooms = {$match: {$and: []}}
                // Min
                var inner_obj = {$gte: bedrooms_range[0]}
                var obj = {bedrooms: inner_obj}
                n_bedrooms['$match']['$and'].push(obj)
                // Max
                var inner_obj = {$lte: bedrooms_range[1]}
                var obj = {bedrooms: inner_obj}
                n_bedrooms['$match']['$and'].push(obj)
                pipeline.push(n_bedrooms)
        
                // Beds
                var n_beds = {$match: {$and: []}}
                // Min
                var inner_obj = {$gte: beds_range[0]}
                var obj = {beds: inner_obj}
                n_beds['$match']['$and'].push(obj)
                // Max
                var inner_obj = {$lte: beds_range[1]}
                var obj = {beds: inner_obj}
                n_beds['$match']['$and'].push(obj)
                pipeline.push(n_beds)
        
                // Square meters
                var n_square_metres = {$match: {$and: []}}
                // Min
                var inner_obj = {$gte: square_metres_range[0]}
                var obj = {square_metres: inner_obj}
                n_square_metres['$match']['$and'].push(obj)
                // Max
                var inner_obj = {$lte: square_metres_range[1]}
                var obj = {square_metres: inner_obj}
                n_square_metres['$match']['$and'].push(obj)
                pipeline.push(n_square_metres)
        
                
                // Count on group by Property Type
                var group = {$group: {_id: "$property_type"}}
                group['$group']["count"] = {}
                group['$group']["count"]['$sum'] = 1
                pipeline.push(group)
        
                
                //console.log(JSON.stringify(pipeline, null, 4))
                collection.aggregate(pipeline).toArray(function(err, docs){
                    if(err) 
                        logger.error(err)

                    if (docs.length == 0)
                    {
                        resolve(null)
                    }
                    else
                    {
                        var infoObj = {
                            city_name: city_name,
                            neighbourhood: neighbourhood
                        }
                        docs.splice(0, 0, infoObj)
                        resolve(docs)
                    }
                    console.log(docs)
                })
            })
        })()
    })
}