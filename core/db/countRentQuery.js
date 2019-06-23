const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_meters_range)
{
    
    //  rating medio, minimo o massimo di case per città, quartiere e categoria (appartamento, loft, ...) e in base ad alcuni servizi 
    //  e mostra solo alcuni tipi di score (precisione, pulizia, orario checkin, comunicazione, location)

    if (city_name === 'All')
    {
        cities_list = ['Bergamo', 'Bologna', 'Firenze', 'Milano', 'Napoli', 'Roma', 'Venezia']
        for (city of cities_list)
        {
            query(city, 'All', property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_meters_range)
        }
    }
    else
    {
        query(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_meters_range)
    }

}

// async per Testing
async function query(city_name, neighbourhood, property_type, amenities, bathrooms_range, bedrooms_range, beds_range, square_meters_range)
{
    await sleep(1200)    //  Testing


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
        var n_square_meters = {$match: {$and: []}}
        // Min
        var inner_obj = {$gte: square_meters_range[0]}
        var obj = {square_metres: inner_obj}
        n_square_meters['$match']['$and'].push(obj)
        // Max
        var inner_obj = {$lte: square_meters_range[1]}
        var obj = {square_metres: inner_obj}
        n_square_meters['$match']['$and'].push(obj)
        pipeline.push(n_square_meters)

        
        // Ratings & Ratings Type
       /* var group = {$group: {_id: null}}
        for(r of ratings){
            group['$group'][r] = {}
            group['$group'][r]['$' + rating_type] = '$review_scores_' + r
        }
        group['$group']["count"] = {}
        group['$group']["count"]['$sum'] = 1

        pipeline.push(group)*/

        
        console.log(JSON.stringify(pipeline, null, 4))
        collection.aggregate(pipeline).toArray(function(err, docs){
            if(err) 
                logger.error(err)

            console.log(docs)
        })
    });
}

//  Testing
query("Milano","BAGGIO",["Bed and breakfast", "Apartment"],["TV", "Wifi"], [1, 3], [1, 3], [1, 3], [59, 65])

//  Testing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}