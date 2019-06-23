const logger = require('loglevel')
const mongoose = require('mongoose')
const config = require('../../config/db')

const option = {
    user: config.user,
    pass: config.password,
    dbName: config.db_name,
    poolSize: 20,
    useNewUrlParser: true
}

mongoose.connect('mongodb://' + config.host + ':' + config.port, option, (error) => {
    if(error) 
        logger.error('Connection to database refused!')
})

module.exports = mongoose.connection