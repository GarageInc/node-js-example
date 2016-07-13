
var PRODUCTION = "production"
var DEVELOPMENT = "development"

if(process.env.NODE_ENV == PRODUCTION){

    console.log("config for PRODUCTION")
    module.exports = require('./config.'+PRODUCTION+'.js');;
} else {

    console.log("config for DEVELOPMENT")
    module.exports = require('./config.'+DEVELOPMENT+'.js');;
}
