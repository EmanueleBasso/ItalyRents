const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')

const app = express()

logger.setLevel('TRACE', false)

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionIndex)

app.use(basicRoutes.functionInvalidPath)      // Default path

app.listen(config.port, config.host, () => logger.info('[System] App ItalyRents deployed at: http://' + config.host + ':' + config.port + config.basepath))