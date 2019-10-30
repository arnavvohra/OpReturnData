require('dotenv').config();
const config = require("./config");
const express = require('express');
const app = express();
const dbQueries = require('./src/services/queries');
const port = process.env.PORT || 8080;

try{
    app.listen(port, () => console.log(`App listening on port ${port}`));
    app.get(`/opreturn/:opReturnData`, dbQueries.getOpReturnData);
}
catch (error){
    console.log(error);
}