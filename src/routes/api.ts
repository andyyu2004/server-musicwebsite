import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { uploadFiles } from '../controllers/uploadController';
import { getTracksInfo, getTrack, getTrackByMagnet, getAlbumsInfo } from '../controllers/getController';
import { registerUser, signInUser, getSalt } from '../controllers/userController';
import * as WebTorrent from 'webtorrent';
// import '../services/pg';


const router = express.Router();

// Middleware to initialise torrentClient instance
router.use('/music/torrent-tracks', (req: any, res, next) => {
  req.torrentClient = new WebTorrent();
  next();
});

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

router.get('/music/tracks', getTracksInfo);
router.get('/music/albums', getAlbumsInfo);

router.head('/music/torrent-tracks/:magnetURI/:fileName', (req, res) => {
  console.log("HEAD");
  // And add some caching or something to prevent repeat behaviour
  getTrackByMagnet(req, res);
});

router.get('/music/torrent-tracks/:magnetURI/:fileName', (req, res) => {
  console.log("FULL GET");
  getTrackByMagnet(req, res);
});

router.get('/music/tracks/:encoding/:id', getTrack);

router.get('/music/artists', (req, res) => {
  res.send("All Artists")
});
router.get('/music/albums', (req, res) => {
  res.send("All Albums")
});

router.post('/upload', uploadFiles);


router.get('/protected', verifyToken, (req: any, res: Response) => {
  console.log(req.token);
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) return res.status(403).send("Err/ Forbidden" + err);
    return res.json({
      message: "AUTHENTICATED",
      authData,
    });
  });
});

function verifyToken(req: any, res: Response, next: NextFunction) {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res.status(403).send("Forbidden");
  }
  const [ , token ] = bearerHeader.split(' ');
  req.token = token;
  next();
}

router.get('/login', (req, res) => {
  const user = {
    id: 1,
    username: "bobluza",
    email: "random@safemail.info",
  };
  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({
      token
    });
  });
});

router.post('/register', registerUser);

// router.post('/signin', signInUser);

import * as passport from 'passport';
router.post('/signin', (req, res, next) => {
  passport.authenticate('local')(req, res, next);
});

// router.post('/signin', passport.authenticate('local'), (req, res) => {
//   console.log(req.login);
// });

router.post('/signin',  (req: any, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.login(user, err => {
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      res.send('You were authenticated & logged in!');
    })
  })(req, res, next);
});

router.get('/testAuth', (req: any, res) => {
  console.log("Test Auth");
  console.log("UserAuthenticated?", req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log(req.session.passport.user);
  }

});

router.get('/salt/:email', getSalt);

router.get('/tracksProtected', (req: any, res) => {
  console.log(req.isAuthenticated());
  console.log(req.session);
});

import query from '../services/mysql';

router.get('/testQuery', async (req, res) => {
  console.log("Test Query");
  const command = "SELECT * FROM Artists";
  const resp = await query(command);
  console.log(resp);
  res.send();
});

export default router;