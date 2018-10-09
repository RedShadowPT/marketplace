/** 
 * Check if Token is valid
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // get "Bearer" token
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, global.config.tokenSecret, (err, token) => {
      if(err) {
        res.status(401).json({ message: "Invalid Bearer token provided" });
      }else {
        next();
      }
    });
  } catch {
    res.status(401).json({ message: "Bearer Token required for this service" });
  }
}
