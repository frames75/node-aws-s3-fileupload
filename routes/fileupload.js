const AWS 		= require('aws-sdk');
const upload 	= require('../multer-s3-fileupload/s3UploadClient').upload
const uploadAJAX = require('../multer-s3-fileupload/s3UploadClient').uploadAJAX
const path 		= require('path');
const express 	= require('express')
const router 	= express.Router()

// This prefix could be used to delete bucket objets by LifeCycle policy.
// Ideally this should be set by "tags" on uploading files, but multer-s3 isn't able to do for now.
const prefixTag = 'some-folder/tmp1d-tagless-';

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/upload.html'));
});

// Upload a file
router.post('/upload', upload.array('inputFile', 3), (req, res) => {
  if (!req.files) res.status(400).json({ error: 'No files were uploaded.' })

  res.status(201).json({
    message: 'Successfully uploaded [[' + req.files.length + ']] files!',
    files: req.files
  })
})

// router.post('/upload-ajax', upload.array('inputFileAJAX', 3), (req, res) => {
router.post('/upload-ajax', (req, res) => {
	uploadAJAX(req, res, (err) => {
	    if(err) {
	        console.log('ERROR Logo: ', err.message);
	        return res.status(500).send(err ? err.message : "Error uploading file.");
	    }

		const dir_logo = req.file.location;
		res.send(dir_logo);
	});
});

// Remember to set CORS policy for the bucket!!
router.get('/uploadPresignedPost', (req, res) => {
	let filename = req.query.filename;

	const awsCredentials = {
		apiVersion: '2006-03-01',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_DEFAULT_REGION,
		signatureVersion: 'v4'
	};

	// AWS.config.update(awsCredentials);
	// const s3 = new AWS.S3();
	const s3 = new AWS.S3(awsCredentials);

	//const tags = '<Tagging><TagSet><Tag><Key>Foo</Key><Value>Bar</Value></Tag></TagSet></Tagging>';

	const params = {
	    Bucket: process.env.AWS_S3_BUCKET,
	    Fields: {
	    	key: getFilenameToBucket(filename)
	    },
	    Conditions: [
			["content-length-range", 1, 200000], // content length restrictions: 0-200KB
			["starts-with", "$Content-Type", "image/"], // content type restriction
			["eq", "$x-amz-meta-userid", "userid"], // tag with userid <= the user can see this!
	    ]
	};

	s3.createPresignedPost(params, (err, data) => {
	  if (err) {
	  	console.log('Error createPresignedPost: ', err);
	    res.status(500).send(err ? err.message : "Error: Presigning post data encountered an error");
	  } else {
		//console.log('DATA: ', data);
		data.fields["x-amz-meta-userid"] = "userid";
		res.json(data);
	  }
	});
});

const getFilenameToBucket = function(filename) {
    return prefixTag + Date.now().toString() + filename;
}

module.exports = router
