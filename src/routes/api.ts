import * as express from 'express';
import * as passport from 'passport';
import { signIn } from '../controllers/authController'; 
import { getTrackByMagnet } from '../controllers/getController';
import { registerUser, signInUser, getSalt } from '../controllers/userController';
import * as WebTorrent from 'webtorrent';
import protectedRouter from './protected';


const router = express.Router();

// Middleware to initialise torrentClient instance
router.use('/music/torrent-tracks', (req: any, res, next) => {
  req.torrentClient = new WebTorrent();
  next();
});

router.use('/protected', passport.authenticate('jwt', { session: false }), protectedRouter);

router.get('/test', (req, res) => {
  console.log('Test API Called');
  res.send('test API');
});

router.get('/refreshLibrary', (req, res) => {
  console.log('Refresh Library API Called');
  res.send('refresh API');
});

router.get('/', (req, res) => {
  res.send('API Root');
});

router.get('/music/torrent-tracks/:magnetURI/:fileName', (req, res) => {
  getTrackByMagnet(req, res);
});



router.get('/music/artists', (req, res) => {
  res.send("All Artists")
});
router.get('/music/albums', (req, res) => {
  res.send("All Albums")
});


router.post('/register', registerUser);

router.post('/signin', signIn);

router.get('/salt/:email', getSalt);

import query from '../services/mysql';

router.get('/testquery', async (req, res) => {
  console.log("Test Query");
  const command = "SELECT * FROM Artists";
  const resp = await query(command);
  console.log(resp);
  res.send();
});

export default router;