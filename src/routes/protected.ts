import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { getTracksInfo, getAlbumsInfo, getTrack } from '../controllers/getController';
import { uploadFiles } from '../controllers/uploadController';

const router = express.Router();
export default router;

router.get('/', (req, res) => {
  console.log('Protected Root');
  console.log("User:", req.user);
  res.send('Protected Root');
});


router.get('/music/tracks', getTracksInfo);
router.get('/music/albums', getAlbumsInfo);
router.post('/upload', uploadFiles);
router.get('/music/tracks/:encoding/:id', getTrack);
