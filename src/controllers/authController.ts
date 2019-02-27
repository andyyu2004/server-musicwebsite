import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import sha1_64 from '../utility/sha1custom';

function signIn(req: any, res, next) {
  // console.log(req.body)
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log("Error in auth/signIn " + err);
      return res.status(400).json({ err });
    }
    req.login(user, err => {
      if (err) { console.log("Error in auth/signIn/login " + err); return res.send(err); }
      //console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      user = user.toLowerCase();
      const userid = sha1_64(user);
      const token = jwt.sign({ user, userid }, process.env.JWT_SECRET);
      res.json({
        message: `Welcome`,
        user,
        token,
        userid,
      });
    });
  })(req, res, next);
}

export { signIn };