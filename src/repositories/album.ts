import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { AlbumModel } from '../models'

async function checkUnique(artist: string, album: string, userid: number): Promise<boolean> {
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  const command = `SELECT * FROM Albums WHERE albumid = ? AND artistid = ? AND userid = ? LIMIT 1`;
  try {
    const res = await query(command, [albumhash, artisthash, userid]).catch(err => { throw err; });
    const isUnique = res.length === 0;
    return isUnique;
  } catch (err) {
    console.log("Failed to select Album" + err);
    throw err;
  }
}

function createAlbumObj(tags, userid: number): AlbumModel {
  const { album, artist, year } = tags.common;
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  return {
    userid,
    album,
    year,
    albumid: albumhash,
    artistid: artisthash,
  };
}

async function addAlbumToDB(album: AlbumModel) {
  const command = "INSERT INTO Albums SET ?";
  try {
    return await query(command, album).catch(err => { console.log(err); throw err });
  } catch (err) {
    console.log("Failed to insert Album" + err);
    throw err;
  }
}

// GET

async function getAllAlbums(userid: number) {
  const command = 
  `SELECT albumid, album, a.artistid, ar.artist, year 
  from Albums a inner join Artists ar on 
  a.artistid = ar.artistid WHERE a.userid = ?`;
  try {
    return await query(command, userid).catch(err => { throw err; });
  } catch (err) {
    console.log("Failed to get Albums " + err);
    throw err;
  }
}

async function getAlbumById(userid: number, albumid: number) {
  const command = `SELECT trackid, title, ar.artist, al.album, 
  genre, filename, encoding, samplerate, bitrate, bitdepth, 
  duration, tracknumber from Tracks t inner join Albums al 
  on t.albumid = al.albumid inner join     
  Artists ar on al.artistid = ar.artistid WHERE 
  t.userid = ? AND al.albumid = ? ORDER BY t.tracknumber`;
  try {
    return await query(command, [userid, albumid]).catch(err => { throw err });
  } catch (err) {
    throw err;
  }
}

export { 
  checkUnique, 
  addAlbumToDB, 
  createAlbumObj, 
  getAllAlbums ,
  getAlbumById,
};