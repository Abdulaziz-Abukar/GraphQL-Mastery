const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWET_EXPIRES_IN } = process.env;

// 1. Sign a token
function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWET_EXPIRES_IN,
  });
}

// 2. verify a token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { signToken, verifyToken };
