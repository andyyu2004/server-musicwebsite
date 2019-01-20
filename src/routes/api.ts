import * as express from 'express';
import * as passport from 'passport';
import { signIn } from '../controllers/authController'; 
import { getTrackByMagnet } from '../controllers/getController';
import { registerUser, getSalt, encrypt } from '../controllers/userController';
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
  res.json('test API');
});

router.get('/refreshLibrary', (req, res) => {
  console.log('Refresh Library API Called');
  res.json('refresh API');
});

router.get('/', (req, res) => {
  res.json({
    res: "API Root"
  });
});

router.get('/error', (req, res) => {
  res.status(500).json({
    err: "Error Message"
  })
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

router.post('/encrypt', encrypt);

import query from '../services/mysql';

router.get('/testquery', async (req, res) => {
  console.log("Test Query");
  const command = "SELECT * FROM Artists";
  const resp = await query(command);
  console.log(resp);
  res.send();
});

export default router;