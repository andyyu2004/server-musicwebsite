import { Strategy as LocalStrategy } from 'passport-local';
import query from './mysql';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export default function(passport) {
  passport.use('local', 
    new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
      const command = `SELECT password from Users WHERE email = ? LIMIT 1`;
      query(command, email)
      .then(resp => {
        if (resp.length === 0) {
          console.log("Email Does Not Exist")
          return done(null, false, { message: "User Does Not Exist" });
        }
        console.log("Email Found")
        return resp[0].password;
      })
      .then(hashedPassword => {
        if (hashedPassword !== password) {
          console.log("Incorrect Password");
          return done(null, false, { message: "Password Incorrect" });
        }
        console.log("AUTHENTICATED");
        done(null, email);
      })
      .catch(err => console.log(err));
    })
  );

  const jwtOpts = {
    //jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwt_token'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwtSecret,
  };

  passport.use('jwt', 
    new JwtStrategy(jwtOpts, (jwt_payload, done) => {
      done(null, jwt_payload.user);
    })
  )

  passport.serializeUser((user, done) => { // User is email for now?
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
     done(null, user);
  });

}