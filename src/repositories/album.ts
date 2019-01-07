import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { AlbumModel } from '../models'

async function checkUnique(artist: string, album: string, userid: number): Promise<boolean> {
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  const command = `SELECT * FROM Albums WHERE albumid = ? AND artist = ? AND userid = ? LIMIT 1`;
  try {
    const res = await query(command, [albumhash, artisthash, userid]).catch(err => { throw err; });
    const isUnique = res.length === 0;
    return isUnique;
  } catch (err) {
    console.log("Failed to select Album" + err);
    throw err;
  }
}

function createAlbumObj(tag, userid: number): AlbumModel {
  const { album, artist } = tag.tags;
  const artisthash = sha1_64(artist + userid);
  const albumhash = sha1_64(artist + album + userid);
  return {
    userid,
    albumid: albumhash,
    artist: artisthash,
    albumname: album,
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
  `SELECT albumid, albumname, artistname from Albums a inner join Artists ar on a.artist = ar.artistid WHERE a.userid = ?;`;
  try {
    return await query(command, userid).catch(err => { throw err; });
  } catch (err) {
    console.log("Failed to get Albums " + err);
    throw err;
  }
}

export { checkUnique, addAlbumToDB, createAlbumObj, getAllAlbums };