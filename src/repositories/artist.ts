import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { ArtistModel } from '../models'

async function checkUnique(artist: string, userid: number): Promise<boolean> {
  const command = `SELECT * FROM Artists WHERE artistname = ? AND userid = ? LIMIT 1`;
  try {
    const res = await query(command, [artist, userid]).catch(err => { throw err; });
    return res.length === 0;
  } catch (err) {
    console.log("Failed to select Artist" + err);
    throw err;
  }
}

function createArtistObject(tag, userid: number): ArtistModel {
  const { artist } = tag.tags;
  const hash = sha1_64(artist + userid);
  return {
    userid,
    artistname: artist,
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


export { checkUnique, addArtistToDB, createArtistObject };