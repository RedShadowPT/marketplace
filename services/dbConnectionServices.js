var debug = require('./debuger')('dbConnectionServices');

// // include Redis Cache server
const cache = require('./cacheServices');

// Database Connection Client
debug("Instanciate Database Connection");
let mysql = require("promise-mysql");

/** 
 * Create mysql connector and connect to database 
 * config.database source is /config.js
 */
global.mysql = mysql.createPool(global.config.database)
// Store default mysql Query into an internal variable for later usage
const _query = global.mysql.query;

/**
 *  Replace default query function with a check if query will be cached
 *      @param: *{
 *                sql: 'SQL query',
 *                cache: true | false  } // enable or disable cache
 *      this also accepts just the SQL query and will execute
 *              * sql query
 */
global.mysql.query = function (options) {
    if (options.cache !== undefined && options.cache === true) {
        return global.mysql.cachedQuery(options.sql);
    }
    if (options.sql !== undefined) {
        return global.mysql.Query(options.sql);
    } else {
        return global.mysql.Query(options);
    }
}

/** 
 * Function used for SQL queries that won't be cached 
 **/
global.mysql.Query = async function () {
    const result = await _query.apply(this, arguments)
    return result;
}

/** 
 * Function used for SQL queries that WILL be cached
 **/
global.mysql.cachedQuery = async function () {
    // generate caching key
    const key = JSON.stringify(arguments);
    // check if redis has values for key
    const cacheValue = await cache.client.get(key);
    if (cacheValue) {
        debug.success('Fetched data from Cache')
        return JSON.parse(cacheValue);
    }
    debug.warning('Fetched data from Database')
    const result = await _query.apply(this, arguments)
    // store query result to cache
    cache.client.set(key, JSON.stringify(result), 'EX', 300);
    return result;
}

module.exports = {};
