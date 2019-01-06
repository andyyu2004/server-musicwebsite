import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';

function signIn(req: any, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log("Error in auth/signIn " + err);
      return res.status(422).send(err);
    }
    req.login(user, err => {
      if (err) { console.log("Error in auth/signIn/login " + err); res.send(err); }
      //console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      const token = jwt.sign({ user }, process.env.jwtSecret);
      res.json({
        message: 'You were authenticated & logged in!',
        user,
        token,
      });
    });
  })(req, res, next);
}

export { signIn };