const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')
const ratingAnalyzerQuery = require('./core/query/ratingAnalyzerQuery')
const rentCountQuery = require('./core/query/rentCountQuery')

const app = express()

logger.setLevel('TRACE', false)

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionRentCount)
app.get(config.basepath + '/' + 'rentCount', basicRoutes.functionRentCount)
app.post(config.basepath + '/' + 'rentCountQuery', rentCountQuery)

app.get(config.basepath + '/' + 'ratingAnalyzer', basicRoutes.functionRatingAnalyzer)
app.post(config.basepath + '/' + 'ratingAnalyzerQuery', ratingAnalyzerQuery)

app.get(config.basepath + '/' + 'ratingClasses', basicRoutes.functionRatingClasses)
//app.post(config.basepath + '/' + 'ratingClassesQuery')

app.get(config.basepath + '/' + 'squareMetresClasses', basicRoutes.functionSquareMetresClasses)
//app.post(config.basepath + '/' + 'squareMetresClassesQuery', )

app.use(basicRoutes.functionInvalidPath)      // Default path

app.listen(config.port, config.host, () => logger.info('[System] App ItalyRents deployed at: http://' + config.host + ':' + config.port + config.basepath))