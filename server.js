const express 	= require('express')
const path 		= require('path');
require('dotenv').config()

const server = express()

// Ensure that S3 Bucket is properly loaded
console.log('S3 BUCKET', process.env.AWS_S3_BUCKET)

// Middleware Plugins
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));

// Routes
server.use('/', require('./routes/fileupload'))

// Start the server
server.listen(7000, error => {
  if (error) console.error('Error starting', error)
  else console.log('Started at http://localhost:7000')
})
