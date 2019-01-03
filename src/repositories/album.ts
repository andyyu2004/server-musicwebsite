import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { AlbumModel } from '../models'

async function checkUnique(artist: string, album: string): Promise<boolean> {
  const artisthash = sha1_64(artist);
  const albumhash = sha1_64(artist+album);
  const command = `SELECT 1 FROM Albums WHERE albumid = ${albumhash} AND artist = ${artisthash}`;
  
  try {
    const res = await query(command);
    const isUnique = res.length === 0;
    return isUnique;
  } catch (err) {
    console.log("Failed to select Album" + err);
    throw err;
  }
}

function createAlbumObj(tag): AlbumModel {
  const { album, artist } = tag.tags;
  const artisthash = sha1_64(artist);
  const albumhash = sha1_64(artist+album);
  
  return {
    albumid: albumhash,
    artist: artisthash,
    albumname: album,
  };
}

async function addAlbumToDB(album: AlbumModel) {
  const command = "INSERT INTO Albums SET ?";
  try {
    return await query(command, album);
  } catch (err) {
    console.log("Failed to insert Album" + err);
    throw err;
  }
}

// GET

async function getAllAlbums() {
  const command = 
  `SELECT albumid, albumname, artistname from albums a inner join artists ar on a.artist = ar.artistid;`;
  try {
    return await query(command);
  } catch (err) {
    console.log("Failed to get Albums " + err);
    throw err;
  }
}

export { checkUnique, addAlbumToDB, createAlbumObj, getAllAlbums };