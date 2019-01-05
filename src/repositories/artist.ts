import sha1_64 from '../utility/sha1custom';
import query from '../services/mysql';
import { ArtistModel } from '../models'

async function checkUnique(artist: string): Promise<boolean> {
  const hash = sha1_64(artist);
  const command = `SELECT 1 FROM Artists WHERE artistid = ?`;
  try {
    const res = await query(command, hash).catch(err => { console.log(err); throw err });
    return res.length === 0;
  } catch (err) {
    console.log("Failed to select Artist" + err);
    throw err;
  }
}

function createArtistObject(tag): ArtistModel {
  const { artist } = tag.tags;
  const hash = sha1_64(artist);
  return {
    artistname: artist,
    artistid: hash,
  };
}

async function addArtistToDB(artist: ArtistModel) {
  const command = "INSERT INTO Artists SET ?";
  try {
    return await query(command, artist).catch(err => { console.log(err); throw err });
  } catch (err) {
    console.log("Failed to insert Artist" + err);
    throw err;
  };
}


export { checkUnique, addArtistToDB, createArtistObject };