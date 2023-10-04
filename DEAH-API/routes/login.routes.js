const express = require('express');
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");

const JWebToken = process.env.JWT_Secret;
/*
router.get('/super-secure-resource', (req, res) => {
    return res
      .status(401)
      .json({ message: "Necesita ingresar al su usuario para acceder" });
  });
*/
router.get("/super-secure-resource", (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Not Authorized" });
    }
  
    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
  
    try {
      // Verify the token is valid
      const { user } = jwt.verify(token, process.env.JWT_Secret);
      return res.status(200).json({
        message: `Congrats ${user}! You can now accesss the super secret resource`,
      });
    } catch (error) {
      return res.status(401).json({ error: "Not Authorized" });
    }
  });

router.post("/", (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} esta tratando de ingresar ..`);
  
    if (username === "admin" && password === "admin") {
      return res.json({
        token: jsonwebtoken.sign({ user: "admin" }, JWebToken),
      });
    }
  
    return res
      .status(401)
      .json({ message: "The username and password your provided are invalid" });
  });

module.exports = router;