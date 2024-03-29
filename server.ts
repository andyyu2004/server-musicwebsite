import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as bodyparser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import * as session from 'express-session';
import * as passport from 'passport';
import * as fs from 'fs-extra';
import { Strategy as LocalStrategy } from 'passport-local';
require('dotenv').config();

import apiRouter from './src/routes/api';

import initPassport from './src/services/passport'; 
initPassport(passport);

const SessionStore = require('session-file-store')(session);
const uuidv4 = require('uuid/v4');

const app = express();

app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(fileUpload());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

// app.use(session({
//   //genid: req => uuidv4(),
//   store: new SessionStore(),
//   secret: process.env.jwtSecret,
//   resave: false,
//   saveUninitialized: false
// }));

app.use(passport.initialize());
// app.use(passport.session());

app.use('/api', apiRouter);

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  // res.send('404 - Music Website');
});

// Creates the /dist/users folder on startup if non-existent
const folderpath = path.join(__dirname, '/users');
fs.exists(folderpath)
  .then(res => {
    if (!res) {
      fs.mkdir(folderpath);
    }
  }).catch(err => console.log(err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Music Server listening on port", port));


