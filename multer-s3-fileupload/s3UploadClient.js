const AWS     = require('aws-sdk');
const multer  = require('multer');
const multerS3 = require('multer-s3');

// This prefix could be used to delete bucket objets by LifeCycle policy.
// Ideally this should be set by "tags" on uploading files, but multer-s3 isn't able to do for now.
const prefixTag = 'some-folder/tmp1d-tagless-';

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

// Limit uploaded file size to 150KB.
const file_size = 150000;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, prefixTag + Date.now().toString() + file.originalname.toLowerCase().slice(-16))
    }
  }),
  limits: { fileSize: file_size }
});

const uploadAJAX = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, prefixTag + Date.now().toString() + file.originalname.toLowerCase().slice(-16))
    }
  }),
  limits: { fileSize: file_size }
})
.single('inputFileAJAX');

module.exports.upload = upload;
module.exports.uploadAJAX = uploadAJAX;
