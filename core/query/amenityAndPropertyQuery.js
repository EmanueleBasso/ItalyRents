const amenityAndPropertyQueryDB = require('../db/amenityAndPropertyQueryDB')

module.exports = async function (req, res){
    var property = req.body.property
    var amenity = req.body.amenity
    var price = req.body.price
    var rating = req.body.rating
    var mq = req.body.mq

    amenityAndPropertyQueryDB(property, amenity, price, rating, mq, sendResponse, res)
}

function sendResponse(result, res, price, rating, mq){
    var priceValue = NaN;
    var ratingValue = NaN;
    var mqValue = NaN;
    var priceCount = 0;
    var ratingCount = 0;
    var mqCount = 0;
    for (var obj of result)
    {
        if (obj != null)
        {
            var p = obj.price;
            var r = obj.rating;
            var m = obj.mq;
            if (p != null)
            {
                if (isNaN(priceValue))
                {
                    priceValue = p
                    if (price == 'avg')
                    {
                        priceCount++;
                    }
                }
                else
                {
                    if (price == 'avg')
                    {
                        priceValue += p
                        priceCount++;
                    }
                    else if (price == 'min')
                    {
                        if (p < priceValue)
                        {
                            priceValue = p
                        }
                    }
                    else if (price == 'max')
                    {
                        if (p > priceValue)
                        {
                            priceValue = p
                        }
                    }
                }
            }
            if (r != null)
            {
                if (isNaN(ratingValue))
                {
                    ratingValue = r
                    if (rating == 'avg')
                    {
                        ratingCount++;
                    }
                }
                else
                {
                    if (rating == 'avg')
                    {
                        ratingValue += r
                        ratingCount++;
                    }
                    else if (rating == 'min')
                    {
                        if (r < ratingValue)
                        {
                            ratingValue = r
                        }
                    }
                    else if (rating == 'max')
                    {
                        if (r > ratingValue)
                        {
                            ratingValue = r
                        }
                    }
                }
            }
            if (m != null)
            {
                if (isNaN(mqValue))
                {
                    mqValue = m
                    if (mq == 'avg')
                    {
                        mqCount++;
                    }
                }
                else
                {
                    if (mq == 'avg')
                    {
                        mqValue += m
                        mqCount++;
                    }
                    else if (mq == 'min')
                    {
                        if (m < mqValue)
                        {
                            mqValue = m
                        }
                    }
                    else if (mq == 'max')
                    {
                        if (m > mqValue)
                        {
                            mqValue = m
                        }
                    }
                }
            }               
        }
    }
    
    if (!isNaN(priceValue))
    {
        if (price == 'avg')
        {
            if (priceCount != 0)
            {
                priceValue /= priceCount
            }
        }
        priceValue = parseFloat((Math.round(((priceValue + 0.00001) * 100)) / 100).toFixed(2))
    }
    else
    {
        priceValue = 'N/A'
    }

    if (!isNaN(ratingValue))
    {
        if (rating == 'avg')
        {
            if (ratingCount != 0)
            {
                ratingValue /= ratingCount
            }
        }
        ratingValue = parseFloat((Math.round(((ratingValue + 0.00001) * 100)) / 100).toFixed(2))
    }
    else
    {
        ratingValue = 'N/A'
    }

    if (!isNaN(mqValue))
    {
        if (mq == 'avg')
        {
            if (mqCount != 0)
            {
                mqValue /= mqCount
            }
        }
        mqValue = parseFloat((Math.round(((mqValue + 0.00001) * 100)) / 100).toFixed(2))
    }
    else
    {
        mqValue = 'N/A'
    }

    var resultObj = {};
    resultObj['price'] = priceValue
    resultObj['rating'] = ratingValue
    resultObj['mq'] = mqValue
    res.json(resultObj)
}