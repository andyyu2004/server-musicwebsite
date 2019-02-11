import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { getTracksInfo, getAlbumsInfo, getTrack, getAlbum, getArtistInfo, getArtist } from '../controllers/getController';
import { uploadFiles } from '../controllers/uploadController';
import { deleteTrack } from '../controllers/deleteController';

const router = express.Router();
export default router;

router.get('/', (req, res) => {
  console.log('Protected Root');
  console.log("User:", req.user);
  res.send('Protected Root');
});


router.get('/music/tracks/:encoding/:id', getTrack);
router.get('/music/albums/:id', getAlbum);
router.get('/music/artists/:id', getArtist);
router.get('/music/tracks', getTracksInfo);
router.get('/music/albums', getAlbumsInfo);
router.get('/music/artists', getArtistInfo);
router.post('/upload', uploadFiles);
router.delete('/music/tracks/:encoding/:id', deleteTrack);
