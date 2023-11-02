const jwt = require("jsonwebtoken");

const JWebToken = process.env.JWT_Secret;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWebToken);
    const usuarioID = decoded.userID;
    if (req.body.userID && req.body.userID != usuarioID) {
      throw "Id de usuario invalido";
    } else {
      req.user_id = usuarioID;
      next();
    }
  } catch {
    res.status(401).json({ message: "No autorizado" });
  }
};
