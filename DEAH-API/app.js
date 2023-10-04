const express = require('express');

//Load env file
require('dotenv').config();

//Setup db connection
require('./config/db');

const apiRoutes = require('./routes/api.routes');
const app = express();
app.use(express.json());
//Api Routes
app.use('/api', apiRoutes)
/*
app.get("/super-secure-resource", (req, res) => {
    return res
      .status(401)
      .json({ message: "Necesita ingresar al su usuario para acceder" });
  });
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server en http://localhost:${port}`);
})