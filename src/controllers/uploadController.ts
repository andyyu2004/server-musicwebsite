import * as jsmediatags from 'jsmediatags';
import { upload } from '../repositories/music';
import promisify from '../utility/promisify';
import * as mm from 'music-metadata';
import { IAudioMetadata } from 'music-metadata'
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { AudioMetadata } from '../models/TrackModel';

async function uploadFiles(req: Request, res: Response) {
  const files: UploadedFile[] = <any> req.files;
  const { userid } = req.authInfo;
  console.log("Files Received");
  if (!files) {
    console.log("Files did not exist");
    return res.status(400).send("Bad Request");
  } else if (Object.keys(files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  try {
    for (const file of Object.keys(files).map(key => files[key])) {
      const res = await uploadFile(file, userid).catch(err => { console.log(err); throw err });
      console.log(res);
    }
    res.status(200).send("All Files Uploaded");
  } catch(err) {
    console.log("UPLOAD FILES FAILED: " + err);
    return res.status(500).send(err);
  }

  // Concurrent doesnt work very well with database
  // const promisesArray = Object.keys(files).map(key => uploadFile(files[key]);
  // Promise.all(promisesArray)
  // .then(resp => {
  //   console.log(resp);
  //   res.status(200).send("All Files Uploaded");
  // })
  // .catch(err =>{
  //   res.status(500).send(err);
  // });
}

async function uploadFile(file: UploadedFile, userid: number) {
  try {
    console.log("Upload File");
    // const filepath = await moveFilePromise(file);
    const tags = await readTags(file)
    // const tag = await readTagsPromise(file).catch(err => { console.log(err); throw err });
    const res = await upload(file, tags, userid).catch(err => { console.log(err); throw err });
    return res;
  } catch(err) {
    console.log("FAILED TO UPLOAD FILE: ");
    throw err;
  }
}

// { format:
//   { tagTypes: [ 'ID3v2.3' ],
//     lossless: false,
//     dataformat: 'mp3',
//     bitrate: 320000,
//     sampleRate: 48000,
//     numberOfChannels: 2,
//     codecProfile: 'CBR',
//     numberOfSamples: 20844288,
//     duration: 434.256 },
//  native: undefined,
//  common:
//   { track: { no: 8, of: null },
//     disk: { no: null, of: null },
//     title: '... And The Great Cold Death Of The Earth',
//     artists: [ 'Agalloch' ],
//     artist: 'Agalloch',
//     album: 'The Mantle',
//     year: 2002,
//     genre: [ 'Atmospheric Folk Black Metal' ] },
//  filename: 'Agalloch - ...And The Great Cold Death Of The Earth.mp3' }

// async function moveFilePromise(file): Promise<any> {
//   const filepath = path.join(__dirname, '../../musicFiles/', file.name);
//   try {
//     await promisify(file.mv)(filepath);
//     return filepath;
//   } catch (err) {
//     console.log("Failed to move file to local: " + err);
//     throw err;
//   }
// }

async function readTags(file: UploadedFile): Promise<AudioMetadata> {
  try {
    const tags: AudioMetadata = await mm.parseBuffer(file.data).catch(err => { throw err; });
    tags.filename = file.name
    // console.log(tags)
    return tags;
  } catch (err) {
    throw err;
  }
}

// function readTagsPromise(file: UploadedFile) {
//   return new Promise((resolve, reject) => {
//     new jsmediatags.Reader(file.data)
//     .read({
//       onSuccess: tag => {
//         tag.tags.filename = file.name;
//         resolve(tag);
//       },
//       onError: err => {
//         reject("Failed to read tags: " + err.type + err.info);
//       },
//     });
//   });
// }




export { uploadFiles };