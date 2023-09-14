const jwt = require("jsonwebtoken")

const config = process.env

const verifyToken = (req, res, next) => {
  const tokenHdr = req.headers['authorization']

  if (!tokenHdr) {
    return res.status(403).send({error: 'ERR_MISSING_TOKEN'})
  }
  const tokens = tokenHdr.split(' ')
  if (tokens.length !== 2) {
    return res.status(403).send({error: 'ERR_INVALID_TOKEN'})
  }
  try {
    const token = tokens[1]
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({error: 'ERR_MALFORMED_TOKEN'})
  }
  return next();
};

module.exports = verifyToken
