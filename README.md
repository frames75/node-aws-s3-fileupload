# Node Express AWS S3 File Upload

A simple file uploader using:

- aws-sdk
- multer & multer-s3 
- AWS.S3.createPresignedPost()

3 ways of upload can be used:
<ul>
  <li><b>"Standard"</b>. Using the server as gateway to send files to the S3 bucket. With multiple files, returning all files info.</li>
  <li><b>With AJAX</b>. Same as previous but using AJAX and filter only image files. Only one file, returning its URL.</li>
  <li><b>Straight from browser</b> (Recommended). Calling the server only to require the <i>Presigned URL</i> used to <i>post</i> to the S3 bucket.</li>
</ul>

## Create .env file and provide values for the following:
```
AWS_S3_BUCKET = 
AWS_ACCESS_KEY_ID = 
AWS_SECRET_ACCESS_KEY = 
AWS_DEFAULT_REGION = 
```

## S3 Bucket configuration
1. In the Bucket name list, choose the name of the bucket that you want.
2. Create a new folder with name *some-folder*.
3. Choose Permissions.
4. Choose Edit to change the public access settings for the bucket. 
- Set ON the two *ACL* options.
- Set OFF the two *bucket policies* options.
- Click Save button.
5. Choose Bucket Policy. In the Bucket policy editor text box, type or copy and paste a new bucket policy:
- Change [[Bucket-Name]] with the name of this bucket.
- Change [[Id-Account]] with the number or your AWS Id Account.
- Change [[Some-User]] with the user you'll user to edit the bucket.

```
{
    "Version": "2012-10-17",
    "Id": "Policy1488494182833",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::[[Bucket-Name]]/some-folder/*"
        },
        {
            "Sid": "AllowUserEdit",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::[[Id-Account]]:user/[[Some-User]]"
            },
            "Action": "s3:PutObject",
            "Resource": [
                "arn:aws:s3:::[[Bucket-Name]]/some-folder",
                "arn:aws:s3:::[[Bucket-Name]]/some-folder/*"
            ]
        },
        {
            "Sid": "AllowUserList",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::[[Id-Account]]:user/[[Some-User]]"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::[[Bucket-Name]]"
        }
    ]
}
```

6. Click Save button.
7. Choose CORS Configuration. In the CORS configuration editor text box, type or copy and paste a new CORS configuration:

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

8. Click Save button.

## Install

After cloning the repo, you can start the app by:

```shell
$ npm install
$ npm run dev
```

Open <http://localhost:7000> in your browser to start ussing the app.

## Resources
### How to use S3 POST signed URLs
* https://advancedweb.hu/how-to-use-s3-post-signed-urls/
### Direct uploads to AWS S3 from the browser
* https://softwareontheroad.com/aws-s3-secure-direct-upload/
### AWS S3 Bucket with NodeJS
* https://medium.com/@Keithweaver_/uploading-a-file-to-amazon-web-services-aws-s3-bucket-with-node-js-133b0a1af2b9

## References
### AWS S3 Official Docs
* https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
### Multer S3
* https://www.npmjs.com/package/multer-s3
### AWS.S3.createPresignedPost()
* https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property
