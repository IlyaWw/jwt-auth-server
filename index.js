require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
mongoose.connect('mongodb://localhost/iv-auth');

// App setup
app.use(morgan('combined')); // logging
app.use(bodyParser.json({ type: '*/*' })); // parsing body as json
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening on:', port);
