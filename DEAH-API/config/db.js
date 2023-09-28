const mongoose = require("mongoose");

const MongoDB_URL = process.env.MongoDB_URL;

mongoose.connect(MongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('error', err => {
    console.log(err);
})
mongoose.connection.on('connected', res => {
    console.log('connected');
});