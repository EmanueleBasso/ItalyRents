const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function(city_name, property_type, amenities, rating, sendResponse, res)
{
    //in base al tipo di score selzionato mostrare su un grafico il numero di proprietà suddivise per tipo o per quartiere 
    //o per servizi che cadono nelle classi del punteggio (0, 1, 2, .., 10)


    if (city_name === 'All')
    {
        await Promise.all([
            query('Bergamo', false, property_type, amenities, rating),
            query('Bologna', false, property_type, amenities, rating),
            query('Firenze', false, property_type, amenities, rating),
            query('Milano', false, property_type, amenities, rating),
            query('Napoli', false, property_type, amenities, rating),
            query('Roma', false, property_type, amenities, rating),
            query('Venezia', false, property_type, amenities, rating)
        ]).then(async (responses) =>  {
            sendResponse(responses, res)
        })
    }
    else
    {
        query(city_name, true, property_type, amenities, rating).then(async (response) => {
            sendResponse([response], res)
        })
    }

}

async function query(city_name, show_neighbourhoods, property_type, amenities, rating)
{
    // await sleep(1200)    //  Testing

    return new Promise( (resolve, reject) => {
        (async () => {
            connection.db.collection('listings' + city_name, function(err, collection){
                if(err)
                    logger.error(err)
        
                var pipeline = []
             
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
      
                // Count
                var ratingType = '$review_scores_' + rating;
                if (show_neighbourhoods) // Counting on values of the selected Rating Type grouped by Neighbourhood and Property Type
                {
                    var group = {
                        $group: {
                            _id: {
                                neighbourhood: '$neighbourhood',
                                propertyType: "$property_type", 
                                ratingClass: ratingType
                            },
                            count: {
                                $sum : 1
                            },
                            price: {
                                $avg : '$price'
                            }
                        }
                    }
                    pipeline.push(group)
                    
                    // var sort = {
                    //     $sort: {
                    //         '_id.neighbourhood': 1,
                    //         '_id.propertyType': 1,
                    //         '_id.ratingClass': 1
                    //     }
                    // }
                    // pipeline.push(sort)

                    var firstProject = {
                        $project: {
                            _id: {
                                neighbourhood: '$_id.neighbourhood',
                                propertyType: '$_id.propertyType'
                            },
                            rating: {
                                ratingClass: '$_id.ratingClass',
                                count: '$count',
                                price: {
                                    $divide: [{
                                        $subtract: [{
                                            $multiply: ['$price',100]
                                        },
                                        {
                                            $mod: [{
                                                $multiply: ['$price',100]
                                            }, 
                                            1]
                                        }
                                    ]},
                                    100]
                                }
                            }
                        }
                    }
                    pipeline.push(firstProject)

                    var createPropertyTypeSet = {
                        $group: {
                            _id: {
                                neighbourhood: '$_id.neighbourhood',
                                propertyType: '$_id.propertyType'
                            },
                            ratings: {
                                $addToSet: '$rating'
                            }
                        }
                    }
                    pipeline.push(createPropertyTypeSet)

                    var firstStepOrderInnerArrayRating = {
                        $unwind: '$ratings'
                    }
                    var secondStepOrderInnerArrayRating = {
                        $sort: {
                            'ratings.ratingClass': 1
                        }
                    }
                    var thirdStepOrderInnerArrayRating = {
                        $group: {
                            _id: '$_id',
                            ratings: {
                                $push:'$ratings'
                            }
                        }
                    }
                    pipeline.push(firstStepOrderInnerArrayRating, secondStepOrderInnerArrayRating, thirdStepOrderInnerArrayRating);


                    var secondProject = {
                        $project: {
                            _id: 0,
                            neighbourhood: '$_id.neighbourhood',
                            value: {
                                propertyType: '$_id.propertyType',
                                ratings: '$ratings'
                            }
                        }
                    }
                    pipeline.push(secondProject)

                    var createOuterNeighbourhoodSet = {
                        $group: {
                            _id: '$neighbourhood',
                            values: {
                                $addToSet: '$value'
                            }
                        }
                    }
                    pipeline.push(createOuterNeighbourhoodSet)

                    var firstStepOrderInnerArrayValues = {
                        $unwind: '$values'
                    }
                    var secondStepOrderInnerArrayValues = {
                        $sort: {
                            'values.propertyType': 1
                        }
                    }
                    var thirdStepOrderInnerArrayValues = {
                        $group: {
                            _id: '$_id',
                            values: {
                                $push:'$values'
                            }
                        }
                    }
                    pipeline.push(firstStepOrderInnerArrayValues, secondStepOrderInnerArrayValues, thirdStepOrderInnerArrayValues);

                    var sortByNeighbourhood = {
                        $sort: {
                            '_id': 1,
                        }
                    }
                    pipeline.push(sortByNeighbourhood)
                }
                else // Counting on values of the selected Rating Type grouped by Property Type
                {
                    var group = {
                        $group: {
                            _id: {
                                propertyType: "$property_type", 
                                ratingClass: ratingType
                            },
                            count: {
                                $sum : 1
                            },
                            price: {
                                $avg : '$price'
                            }
                        }
                    }
                    pipeline.push(group)
                    
                    var firstProject = {
                        $project: {
                            _id: '$_id.propertyType',
                            rating: {
                                ratingClass: '$_id.ratingClass',
                                count: '$count',
                                price: {
                                    $divide: [{
                                        $subtract: [{
                                            $multiply: ['$price',100]
                                        },
                                        {
                                            $mod: [{
                                                $multiply: ['$price',100]
                                            }, 
                                            1]
                                        }
                                    ]},
                                    100]
                                }
                            }
                        }
                    }
                    pipeline.push(firstProject)

                    var createPropertyTypeSet = {
                        $group: {
                            _id: '$_id',
                            ratings: {
                                $addToSet: '$rating'
                            }
                        }
                    }
                    pipeline.push(createPropertyTypeSet)

                    var firstStepOrderInnerArrayRating = {
                        $unwind: '$ratings'
                    }
                    var secondStepOrderInnerArrayRating = {
                        $sort: {
                            'ratings.ratingClass': 1
                        }
                    }
                    var thirdStepOrderInnerArrayRating = {
                        $group: {
                            _id: '$_id',
                            ratings: {
                                $push:'$ratings'
                            }
                        }
                    }
                    pipeline.push(firstStepOrderInnerArrayRating, secondStepOrderInnerArrayRating, thirdStepOrderInnerArrayRating);

                    var project = {
                        $project: {
                            _id: 0,
                            propertyType: '$_id',
                            ratings: 1
                        }
                    }
                    pipeline.push(project)

                    var sortByPropertyType = {
                        $sort: {
                            'propertyType': 1,
                        }
                    }
                    pipeline.push(sortByPropertyType)
                }

                console.log(JSON.stringify(pipeline, null, 4))
                collection.aggregate(pipeline).toArray(function(err, docs){
                    if(err) 
                        logger.error(err)
                        
                    // console.log(JSON.stringify(docs, null, 4)) //Visualizzazione compelta
                    // console.log(docs) //Visualizzazione compatta
                    if (docs.length == 0)
                    {
                        resolve(null)
                    }
                    else
                    {
                        if (!show_neighbourhoods)
                        {
                            var infoObj = {
                                city_name: city_name,
                            }
                            docs.splice(0, 0, infoObj)
                        }
                        resolve(docs)
                    }
                })
            })
        })()
    })
}

// //  Testing
// query("Milano", false, ["Bed and breakfast", "Apartment", "House"],["TV", "Wifi"], "location")

// // Testing
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }