import * as fs from 'fs';
import { ReadStream } from 'fs';
import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import * as path from 'path';
import { TrackModel } from '../models';
import { uploadFileS3, getFileS3 } from '../services/aws';
import promisify from '../utility/promisify';
import { IAudioMetadata } from 'music-metadata';
import { AudioMetadata } from '../models/TrackModel';

// POST

async function checkUnique(artist: string, album: string, title: string, userid: number): Promise<boolean> {
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  const trackhash = sha1_64(artist + album + title + userid);
  const command = `SELECT * FROM Tracks 
    WHERE trackid = ? 
    AND artistid = ?
    AND albumid = ?
    AND userid = ?
    LIMIT 1`;
  try {
    const res = await query(command, [trackhash, artisthash, albumhash, userid]).catch(err => { throw err; });
    return res.length === 0;
  } catch (err) {
    console.log("Failed to select Track" + err);
    throw err;
  }
}

function createTrackObj(tags: AudioMetadata, userid: number): TrackModel {
  const { title, track, genre : genres, lyrics, comment, album, artist } = tags.common;
  const { bitrate, sampleRate, duration , bitsPerSample} = tags.format;
  const { filename } = tags;
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  const trackhash = sha1_64(artist + album + title + userid);
  const lyric = lyrics ? lyrics[0] : "";
  const comments = comment ? comment[0] : "";
  const encoding = path.extname(filename);
  const genre = genres ? genres[0] : ""
  return {
    filename, 
    title,
    encoding,
    comments,
    userid,
    genre,
    bitrate,
    sampleRate,
    duration,
    bitdepth: bitsPerSample,
    trackid: trackhash,
    albumid: albumhash,
    artistid: artisthash,
    trackNumber: track.no || 0,
    lyrics: lyric,
  };
}

async function addTrackToDB(track: TrackModel) {
  const command = "INSERT INTO Tracks SET ?";
  try {
    return await query(command, track).catch(err => { throw err; });
  } catch (err) {
    console.log("Failed to insert Track" + err);
    throw err;
  }
}

function uploadTrack(filepath: string) {
  uploadFileS3(filepath);
}

// GET

async function getAllTracks(userid: string) {
  const command = 
    `SELECT trackid, title, ar.artist, al.album, genre, filename, encoding, samplerate, bitrate, bitdepth, duration, tracknumber
    from Tracks t inner join Albums al on t.albumid = al.albumid inner join 
    Artists ar on al.artistid = ar.artistid WHERE t.userid = ? ORDER BY t.title`;
  try {
    return await query(command, userid).catch(err => { throw err; });
  } catch (err) {
    console.log("Failed to get Tracks " + err);
    throw err;
  }
}

async function getFileStream(userid: number, encoding: string, trackid: number): Promise<[ReadStream, number]> {
  try {
    const filepath = path.join(__dirname, '../../users/', userid.toString(), trackid.toString() + encoding);
    const stats = await promisify(fs.stat)(filepath).catch(err => { throw err; });
    return [fs.createReadStream(filepath), stats.size];
  } catch (err) {
    throw err;
  }
}

async function getTrackFile(filename: string) {
  console.log(`Getting file from s3: ${filename}`);
  const filepath = path.join(__dirname, '../../', filename);
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

// DELETE

async function deleteTrackFile(userid, trackid, encoding) {
  const filepath = path.join(__dirname, '../../users/', userid.toString(), trackid.toString() + encoding);
  const command = `DELETE FROM Tracks WHERE trackid = ? AND userid = ? AND encoding = ?`
  try {
    fs.unlink(filepath, err => console.log(err))
    query(command, [trackid, userid, encoding])
  } catch (err) {
    throw err
  }
}

export { 
  checkUnique, 
  addTrackToDB, 
  createTrackObj,
  getAllTracks,   
  getTrackFile,
  uploadTrack,
  getFileStream,
  deleteTrackFile,
}