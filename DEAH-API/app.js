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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server en http://localhost:${port}`);
})