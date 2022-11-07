const jwt = require("jsonwebtoken");
const verifyJwt = (req, res, next) => {
  const token = req.header("user-auth-token");
  if (!token) {
    res.status(401).send("unauthorization user");
  } else {
    try {
      const decode = jwt.sign(token, process.env.JWT_SECRETE);
      req.user = decode.user;
      next();
    } catch (err) {
      res.status(401).send("token is not valid");
    }
  }
};
module.exports = verifyJwt;
