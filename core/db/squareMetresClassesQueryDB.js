const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range, sendResponse, res){
    if(city_name === 'All'){
        await Promise.all([
            query('Bergamo', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range), 
            query('Bologna', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range),
            query('Firenze', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range), 
            query('Milano', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range), 
            query('Napoli', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range), 
            query('Roma', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range), 
            query('Venezia', neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range)]).then(async (responses) => {
                var result = sumResultAndRename(responses, 'All', null)

                sendResponse(result, res)
            })
    }else{
        query(city_name, neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range).then(async (response) => {
            var result = sumResultAndRename([response], city_name, neighbourhood)

            sendResponse(result, res)
        })
    }
}

async function query(city_name, neighbourhood, property_type, bathrooms_range, bedrooms_range, beds_range, price_range){
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
                for(p of property_type){
                    var obj = {}
                    obj['property_type'] = p
                    
                    p_type['$match']['$or'].push(obj)
                }
                pipeline.push(p_type)

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

                // Price
                var val_price = {$match: {$and: []}}
                // Min
                var inner_obj = {$gte: price_range[0]}
                var obj = {price: inner_obj}
                val_price['$match']['$and'].push(obj)
                // Max
                var inner_obj = {$lte: price_range[1]}
                var obj = {price: inner_obj}
                val_price['$match']['$and'].push(obj)
                pipeline.push(val_price)

                // Project
                var project = {$project: {'range': {$concat: []}}}
                for(var mq = 30, i = 0; mq < 280; mq += 50, i++){
                    var cond = {$cond: [{$and: [{$gte: ['$price', mq]}, {$lt: ['$price', mq + 50]}]}, i.toString(), '']}
                    project['$project']['range']['$concat'].push(cond)

                }
                pipeline.push(project)

                // Group + Count
                var group = {$group: {_id: '$range', count: {$sum: 1}}}
                pipeline.push(group)

                //console.log(JSON.stringify(pipeline, null, 4))
                collection.aggregate(pipeline).toArray(function(err, docs){
                    if(err) 
                        logger.error(err)
                    
                    if(docs[0] == undefined){
                        resolve(null)
                    }else{
                        var filtered_docs = docs.filter(function(value){
                            return value._id != ''
                        })
                            
                        resolve(filtered_docs)
                    }
                })
            })
        })()
    })
}

function sumResultAndRename(responses, city, neighbourhood){
    var result = {
        'city': city,
        'neighbourhood': neighbourhood,
        '30 - 80': 0,
        '80 - 130': 0,
        '130 - 180': 0,
        '180 - 230': 0,
        '230 - 280': 0
    }

    for(obj of responses){
        for(obj_int of obj){
            switch(obj_int['_id']){
                case '0': result['30 - 80'] += obj_int['count']
                            break
                case '1': result['80 - 130'] += obj_int['count']
                            break
                case '2': result['130 - 180'] += obj_int['count']
                            break
                case '3': result['180 - 230'] += obj_int['count']
                            break
                case '4': result['230 - 280'] += obj_int['count']
                            break
            }
        }
    }

    return result
}