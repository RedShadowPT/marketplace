module.exports =
{
  "database" : {
    "host" :  "127.0.0.1",
    "user" : "market",
    "password" : "<dbpassword>",
    "database" : "marketplace",
    "connectionLimit": 100
  },
  "cacheServer": "redis://127.0.0.1:6379",
  "tokenSecret": "SET Your Own Token Secret Here"
}