const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(property, amenity, price, rating, mq, sendResponse, res){
    await Promise.all([
        query('Bergamo', property, amenity, price, rating, mq), 
        query('Bologna', property, amenity, price, rating, mq),
        query('Firenze', property, amenity, price, rating, mq), 
        query('Milano', property, amenity, price, rating, mq), 
        query('Napoli', property, amenity, price, rating, mq), 
        query('Roma', property, amenity, price, rating, mq), 
        query('Venezia', property, amenity, price, rating, mq)]).then(async (responses) => {
            sendResponse(responses, res, price, rating, mq)
        })
}

async function query(city, property, amenity, price, rating, mq){
    return new Promise( (resolve, reject) => {
        (async () => {
            connection.db.collection('listings' + city, function(err, collection){
                if(err)
                    logger.error(err)

                var pipeline = []

                // Property
                var pType = {
                    $match: {
                        property_type: property
                    }
                }
                pipeline.push(pType)

                // Amenity
                var aType = {
                    $match: {
                    }
                }
                aType['$match']['amenities.' + amenity] = true;
                pipeline.push(aType)

                // Group
                var group = {
                    $group: {
                        _id: null
                    }
                }
                group['$group']['price'] = {}
                group['$group']['price']['$' + price] = '$price'
                group['$group']['rating'] = {}
                group['$group']['rating']['$' + rating] = {
                    $divide: [{
                        $add: [
                            '$review_scores_accuracy', '$review_scores_cleanliness', '$review_scores_checkin', '$review_scores_communication', '$review_scores_location'
                        ]
                    }, 5]
                }
                group['$group']['mq'] = {}
                group['$group']['mq']['$' + mq] = '$square_metres'
                pipeline.push(group)

                //console.log(JSON.stringify(pipeline, null, 4))
                collection.aggregate(pipeline).toArray(function(err, docs){
                    if(err) 
                        logger.error(err)
                    
                    if(docs[0] == undefined){
                        resolve(null)
                    }else{
                        delete docs[0]._id
    
                        resolve(docs[0])
                    }
                })
            })
        })()
    })
}