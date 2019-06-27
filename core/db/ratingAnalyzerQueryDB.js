const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, neighbourhood, property_type, amenities, ratings, rating_type, sendResponse, res){
    if(city_name === 'All'){
        await Promise.all([
            query('Bergamo', neighbourhood, property_type, amenities, ratings, rating_type), 
            query('Bologna', neighbourhood, property_type, amenities, ratings, rating_type),
            query('Firenze', neighbourhood, property_type, amenities, ratings, rating_type), 
            query('Milano', neighbourhood, property_type, amenities, ratings, rating_type), 
            query('Napoli', neighbourhood, property_type, amenities, ratings, rating_type), 
            query('Roma', neighbourhood, property_type, amenities, ratings, rating_type), 
            query('Venezia', neighbourhood, property_type, amenities, ratings, rating_type)]).then(async (responses) => {
                sendResponse(responses, res)
            })
    }else{
        query(city_name, neighbourhood, property_type, amenities, ratings, rating_type).then(async (response) => {
            sendResponse([response], res)
        })
    }
}

async function query(city_name, neighbourhood, property_type, amenities, ratings, rating_type){
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
                pipeline.push(group)

                // Approximation Project
                var project = {$project: {}}
                for(r of ratings){
                    project['$project'][r] =  {
                        $divide: [{
                            $subtract: [{
                                $multiply: ['$' + r, 100]
                            },
                            {
                                $mod: [{
                                    $multiply: ['$' + r, 100]
                                }, 
                                1]
                            }
                        ]},
                        100]
                    }
                }
                pipeline.push(project)
                
                //console.log(JSON.stringify(pipeline, null, 4))
                collection.aggregate(pipeline).toArray(function(err, docs){
                    if(err) 
                        logger.error(err)
                    
                    if(docs[0] == undefined){
                        resolve(null)
                    }else{
                        delete docs[0]._id
                        docs[0].city_name = city_name
                        docs[0].neighbourhood = neighbourhood
    
                        resolve(docs[0])
                    }
                })
            })
        })()
    })
}