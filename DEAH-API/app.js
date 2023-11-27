const express = require("express");

//Load env file
require("dotenv").config();

//Setup db connection
require("./config/db");

const apiRoutes = require("./routes/api.routes");
const app = express();
app.use(express.json());

//Api Routes
app.use("/api", apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.DEVELOP)
    console.log(`Server en ${process.env.API_URL}:${port}`);
  else console.log(`Server en ${process.env.API_DEPLOY_URL}:${port}`);
});
