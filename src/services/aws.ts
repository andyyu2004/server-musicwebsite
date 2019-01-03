import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';


// AWS.config.update({
//   accessKeyId: 
//   secretAccessKey: 
// });

const s3 = new AWS.S3();

export function uploadFileS3(filepath: string) {
  const params = {
    Bucket: "musicbucket2004",
    Body : fs.createReadStream(filepath),
    Key : "music/" + path.basename(filepath)
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err)
        reject(err); 
      }
      console.log(data);
      resolve(data);
    });
  });
}

export function getFileS3(filepath: string) {
  const params = {
    Bucket: "musicbucket2004",
    Key : "music/" + path.basename(filepath)
  };
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    });
  });
}