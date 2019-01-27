import * as path from 'path';
import * as fs from 'fs-extra'; 
import promisify from '../utility/promisify';
import { checkUnique as checkArtistUnique, createArtistObject, addArtistToDB } from './artist';
import { checkUnique as checkAlbumUnique, createAlbumObj, addAlbumToDB } from './album';
import { checkUnique as checkTrackUnique, createTrackObj, addTrackToDB, uploadTrack } from './track';
import { UploadedFile } from 'express-fileupload';
import { Upload } from 'aws-sdk/clients/devicefarm';
import { AudioMetadata } from '../models/TrackModel';

// async function upload(file: UploadedFile, tag, userid: number) {
//   try {
//     if (!tag.tags.artist) { tag.tags.artist = "Unknown Artist"; }
//     if (!tag.tags.album) { tag.tags.album = "Unknown Album"; } 
//     if (!tag.tags.title) { tag.tags.title = "Unknown Track"; }
//     const { artist, album, title } = tag.tags;
//     // Check if already existent in database
//     const artistIsUnique = await checkArtistUnique(artist, userid).catch(err => { throw err });
//     if (artistIsUnique) {
//       const newArtist = createArtistObject(tag, userid);
//       await addArtistToDB(newArtist);
//     }
//     const albumIsUnique = await checkAlbumUnique(artist, album, userid).catch(err => { throw err });
//     if (albumIsUnique) {
//       const newAlbum = createAlbumObj(tag, userid);
//       await addAlbumToDB(newAlbum);
//     }
//     const trackIsUnique = await checkTrackUnique(artist, album, title, userid).catch(err => { throw err });
//     if (trackIsUnique) {
//       console.log(`${artist}/${album}/${title} does not exist`);
//       const newTrack = createTrackObj(tag, userid);
//       const { trackid, encoding } = newTrack;
//       await addTrackToDB(newTrack);
//       // Aync upload to s3
//       await moveFile(file, userid, trackid, encoding);
//       // uploadTrack(tag.tags.localpath);
//       return `Uploading ${artist}/${album}/${title} to s3`;
//     } else {
//       return `${artist}/${album}/${title} already exists`;
//     }

//   } catch (err) {
//     console.log("FAILED TO UPLOAD IN music.ts" + err);
//     throw err;
//   }
// }

async function upload(file: UploadedFile, tags: AudioMetadata, userid: number) {
  // console.log("Common", tags.common)
  // console.log("Format", tags.format)
  // console.log("Native", tags.native)
  try {
    if (!tags.common.artist) { tags.common.artist = "Unknown Artist"; }
    if (!tags.common.album) { tags.common.album = "Unknown Album"; } 
    if (!tags.common.title) { tags.common.title = "Unknown Track"; }
    const { artist, album, title } = tags.common;
    // Check if already existent in database
    const artistIsUnique = await checkArtistUnique(artist, userid).catch(err => { throw err });
    if (artistIsUnique) {
      const newArtist = createArtistObject(tags, userid);
      await addArtistToDB(newArtist);
    }
    const albumIsUnique = await checkAlbumUnique(artist, album, userid).catch(err => { throw err });
    if (albumIsUnique) {
      const newAlbum = createAlbumObj(tags, userid);
      await addAlbumToDB(newAlbum);
    }
    const trackIsUnique = await checkTrackUnique(artist, album, title, userid).catch(err => { throw err });
    if (trackIsUnique) {
      console.log(`${artist}/${album}/${title} does not exist`);
      const newTrack = createTrackObj(tags, userid);
      const { trackid, encoding } = newTrack;
      await addTrackToDB(newTrack);
      await moveFile(file, userid, trackid, encoding);
      return `Uploading ${artist}/${album}/${title} to s3`;
    } else {
      return `${artist}/${album}/${title} already exists`;
    }
  } catch (err) {
    console.log("FAILED TO UPLOAD IN music.ts" + err);
    throw err;
  }
}

async function moveFile(file: UploadedFile, userid: number, id: number, encoding: string) {
  try {
    const folderpath = path.join(__dirname, '../../users', userid.toString());
    const folderExists = await fs.exists(folderpath);
    if (!folderExists) {
      await fs.mkdir(path.join(folderpath));
    }
    const filepath = path.join(folderpath, id.toString() + encoding);
    await promisify(file.mv)(filepath).catch(err => { console.log(err); throw err });
  } catch (err) {
    console.log("FAILED TO MOVE FILE TO LOCAL!!!");
    throw err;
  }
}

export { upload };