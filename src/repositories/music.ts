import * as path from 'path';
import * as fs from 'fs';
import promisify from '../utility/promisify';
import { checkUnique as checkArtistUnique, createArtistObject, addArtistToDB } from './artist';
import { checkUnique as checkAlbumUnique, createAlbumObj, addAlbumToDB } from './album';
import { checkUnique as checkTrackUnique, createTrackObj, addTrackToDB, uploadTrack } from './track';
import { UploadedFile } from 'express-fileupload';
import { Upload } from 'aws-sdk/clients/devicefarm';

async function upload(file: UploadedFile, tag) {
  try {
    if (!tag.tags.artist) { tag.tags.artist = "Unknown Artist"; }
    if (!tag.tags.album) { tag.tags.album = "Unknown Album"; } 
    if (!tag.tags.title) { tag.tags.title = "Unknown Track"; }
    const { artist, album, title } = tag.tags;
    // Check if already existent in database
    const artistIsUnique = await checkArtistUnique(artist);
    if (artistIsUnique) {
      const newArtist = createArtistObject(tag);
      await addArtistToDB(newArtist);
    }
    const albumIsUnique = await checkAlbumUnique(artist, album);
    if (albumIsUnique) {
      const newAlbum = createAlbumObj(tag);
      await addAlbumToDB(newAlbum);
    }
    const trackIsUnique = await checkTrackUnique(artist, album, title);
    if (trackIsUnique) {
      console.log(`${artist}/${album}/${title} does not exist`);
      const newTrack = createTrackObj(tag);
      const { trackid, encoding } = newTrack;
      await addTrackToDB(newTrack);
      // Aync upload to s3
      await moveFile(file, trackid, encoding);
      // uploadTrack(tag.tags.localpath);
      return `Uploading ${artist}/${album}/${title} to s3`;
    } else {
      return `${artist}/${album}/${title} already exists`;
    }
  } catch(err) {
    console.log("FAILED TO UPLOAD IN music.ts");
    throw err;
  }
}

async function moveFile(file: UploadedFile, id: number, encoding: string) {
  try {
    const filepath = path.join(__dirname, '../../', id.toString() + encoding);
    // await promisify(fs.open)(filepath, 'w');
    await promisify(file.mv)(filepath);
  } catch (err) {
    console.log("FAILED TO MOVE FILE TO LOCAL!!!");
    throw err;
  }
}

export { upload };