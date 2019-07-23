import { Request, Response } from 'express';
import { deleteTrackFile } from '../repositories/track';

async function deleteTrack(req: Request, res: Response) {
  // Maybe remove encoding from the api url
  const { encoding, id } = req.params;
  console.log(encoding, id);
  const { userid } = req.authInfo;
  try {
    await deleteTrackFile(userid, id, encoding)
  } catch (err) {
    console.log("Failed to delete", err);
    return res.status(500).send(err)
  }
  return res.status(200).send("Successfully Deleted")
}

export {
  deleteTrack,
};