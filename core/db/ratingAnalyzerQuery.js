const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, neighbourhood, property_type, amenities, ratings, rating_type){
    
    //  rating medio, minimo o massimo di case per città, quartiere e categoria (appartamento, loft, ...) e in base ad alcuni servizi 
    //  e mostra solo alcuni tipi di score (precisione, pulizia, orario checkin, comunicazione, location)

    if(city_name === 'All'){
        cities_list = ['Bergamo', 'Bologna', 'Firenze', 'Milano', 'Napoli', 'Roma', 'Venezia']

        for(city of cities_list){
            query(city, 'All', property_type, amenities, ratings, rating_type)
        }
    }else{
        query(city_name, neighbourhood, property_type, amenities, ratings, rating_type)
    }

}

// async per Testing
async function query(city_name, neighbourhood, property_type, amenities, ratings, rating_type){
    await sleep(500)    //  Testing


    connection.db.collection('listings' + city_name, function(err, collection){
        if(err)
            logger.error(err)

        var pipeline = []

        // Neighbourhood
        if(neighbourhood !== 'All')
            pipeline.push({$match: {neighbourhood: neighbourhood}})

        // Property Type
        var p_type = {$match: {$or: []}}
        for(p of property_type){
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
        
        // Ratings & Ratings Type
        var group = {$group: {_id: null}}
        for(r of ratings){
            group['$group'][r] = {}
            group['$group'][r]['$' + rating_type] = '$review_scores_' + r
        }
        group['$group']["count"] = {}
        group['$group']["count"]['$sum'] = 1

        pipeline.push(group)

        
        console.log(JSON.stringify(pipeline, null, 4))
        collection.aggregate(pipeline).toArray(function(err, docs){
            if(err) 
                logger.error(err)

            console.log(docs[0])
        })
    });
}

//  Testing
query("Milano","BAGGIO",["Bed and breakfast", "Apartment"],["TV", "Wifi"],["accuracy", "communication"],"avg")

//  Testing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}