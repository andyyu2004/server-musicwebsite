import { Strategy as LocalStrategy } from 'passport-local';
import query from './mysql';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export default function(passport) {
  passport.use('local', 
    new LocalStrategy({ usernameField: "email", session: false }, (email, password, done) => {
      const command = `SELECT password from Users WHERE email = ? LIMIT 1`;
      query(command, email)
      .then(resp => {
        if (resp.length === 0) {
          console.log("Email Does Not Exist")
          return done(null, false, { message: "User Does Not Exist" });
        }
        return resp[0].password;
      })
      .then(hashedPassword => {
        if (hashedPassword !== password) {
          return done(null, false, { message: "Password Incorrect" });
        }
        console.log("Authenticated");
        return done(null, email);
      })
      .catch(err => console.log(err));
    })
  );

  passport.use('jwtFromQueryParameter', 
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwt_token'),
      secretOrKey: process.env.JWT_SECRET,
      session: false,
    }, (jwt_payload, done) => {
      const { user, userid } = jwt_payload;
      done(null, user, { userid }); // access req.authInfo.userid
    })
  )

  passport.use('jwtFromBearerHeader', 
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      session: false,
    }, (jwt_payload, done) => {
      const { user, userid } = jwt_payload;
      done(null, user, { userid }); // access req.authInfo.userid
    })
  );

  passport.serializeUser((user, done) => { // User is email for now? changed to id
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
     done(null, user);
  });

}