exports.functionIndex = async function (req, res){
    res.render('rentCount')
}

exports.functionBadRequest = async function (req, res){
    var error = {}
    error.type = '400'
    error.message = 'Cannot process the request (malformed request syntax)'

    res.render('errorPage', {error})
}

exports.functionInvalidPath = async function (req, res){
    var error = {}
    error.type = '404'
    error.message = 'The page you are looking for might have been removed, had ' + 
        'its name changed or is temporarily unavailable'

    res.render('errorPage', {error})
}

exports.functionInternalServerError = async function (req, res){
    var error = {}
    error.type = '500'
    error.message = 'Internal Server Error'

    res.render('errorPage', {error})
}