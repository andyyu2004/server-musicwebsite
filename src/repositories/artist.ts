import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { ArtistModel } from '../models'
import { IAudioMetadata } from 'music-metadata';

async function checkUnique(artist: string, userid: number): Promise<boolean> {
  const command = `SELECT * FROM Artists WHERE artist = ? AND userid = ? LIMIT 1`;
  try {
    const res = await query(command, [artist, userid]).catch(err => { throw err; });
    return res.length === 0;
  } catch (err) {
    console.log("Failed to select Artist" + err);
    throw err;
  }
}

function createArtistObject(tags: IAudioMetadata, userid: number): ArtistModel {
  const { artist } = tags.common;
  const hash = sha1_64(artist + userid);
  return {
    userid,
    artist,
    artistid: hash,
  };
}

async function addArtistToDB(artist: ArtistModel) {
  const command = "INSERT INTO Artists SET ?";
  try {
    return await query(command, artist).catch(err => { throw err; });
  } catch (err) {
    console.log("Failed to insert Artist" + err);
    throw err;
  };
}

async function getArtists(userid: number) {
  const command = `SELECT artist, artistid FROM Artists WHERE userid = ?`;
  try {
    return await query(command, userid).catch(err => { throw err; });
  } catch (err) {
    throw err;
  }
}

async function getArtistById(userid: number, artistid: number) {
  const command = `SELECT albumid, album, a.artistid, ar.artist, year 
    FROM Albums a inner join Artists ar on 
    a.artistid = ar.artistid WHERE ar.userid = ? AND a.artistid = ?`;
    try {
      return await query(command, [userid, artistid]).catch(err => { throw err; });
    } catch (err) {
      throw err;
    }
}


export { 
  checkUnique, 
  addArtistToDB, 
  createArtistObject,
  getArtists,
  getArtistById,
 };