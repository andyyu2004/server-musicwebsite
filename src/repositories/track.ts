import * as fs from 'fs';
import { ReadStream } from 'fs';
import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import * as path from 'path';
import { TrackModel } from '../models';
import { uploadFileS3, getFileS3 } from '../services/aws';
import promisify from '../utility/promisify';

// POST

async function checkUnique(artist: string, album: string, title: string): Promise<boolean> {
  const artisthash = sha1_64(artist);
  const albumhash = sha1_64(artist+album);
  const trackhash = sha1_64(artist+album+title);
  const command = `SELECT 1 FROM Tracks 
    WHERE trackid = ${trackhash} 
    AND artist = ${artisthash}
    AND album = ${albumhash}`;
  try {
    const res = await query(command);
    return res.length === 0;
  } catch (err) {
    console.log("Failed to select Track" + err);
    throw err;
  }
}

function createTrackObj(tag): TrackModel {
  const { title, track, genre, lyrics, filename, comment, album, artist } = tag.tags;
  const artisthash = sha1_64(artist);
  const albumhash = sha1_64(artist+album);
  const trackhash = sha1_64(artist+album+title);
  const lyric = lyrics ? lyrics.lyrics : "";
  const comments = comment ? comment.text : "";
  const encoding = path.extname(filename);
  return {
    filename, 
    title,
    encoding,
    comments,
    trackid: trackhash,
    album: albumhash,
    artist: artisthash,
    trackNumber: track || 0,
    lyrics: lyric,
    genre: genre || "",
  };
}

async function addTrackToDB(track: TrackModel) {
  const command = "INSERT INTO Tracks SET ?";
  try {
    return await query(command, track);
  } catch (err) {
    console.log("Failed to insert Track" + err);
    throw err;
  }
}

function uploadTrack(filepath: string) {
  uploadFileS3(filepath);
}

// GET

async function getAllTracks() {
  const command = 
    `SELECT trackid, title, artistname, albumname, genre, filename, encoding 
    from tracks t inner join albums al on t.album = al.albumid inner join 
    artists ar on al.artist = ar.artistid ORDER BY t.title`;
  try {
    return await query(command);
  } catch (err) {
    console.log("Failed to get Tracks " + err);
    throw err;
  }
}

async function getFileStream(encoding: string, trackid: number): Promise<[ReadStream, number]> {
  try {
    const filepath = path.join(__dirname, '../../musicFiles/', trackid.toString() + encoding);
    const stats = await promisify(fs.stat)(filepath);
    return [fs.createReadStream(filepath), stats.size];
  } catch (err) {
    throw err;
  }
}

async function getTrackFile(filename: string) {
  console.log(`Getting file from s3: ${filename}`);
  const filepath = path.join(__dirname, '../../musicFiles/', filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) reject(err);
      console.log(data);
      resolve({
        randomstuff: "sdfsdf",
        body: data,
      });
    });
  });
  //return await getFileS3(filename);
}

export { 
  checkUnique, 
  addTrackToDB, 
  createTrackObj,
  getAllTracks,   
  getTrackFile,
  uploadTrack,
  getFileStream,
};