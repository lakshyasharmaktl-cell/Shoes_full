const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT containing admin id and role.
 * Role is embedded in the token so roleMiddleware can check
 * access without hitting the database again.
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;