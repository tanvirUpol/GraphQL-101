const express = require('express');
const colors = require('colors');
require('dotenv').config();
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000

const app = express();

// connect to database
connectDB()

app.use('/graphql',createHandler({
    schema
}))

app.listen(port, console.log(`server listening on ${port}`));
