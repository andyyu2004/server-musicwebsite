import { Strategy as LocalStrategy } from 'passport-local';
import query from './mysql';

export default function(passport) {
  passport.use(
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

  passport.serializeUser((user, done) => { // User is email for now?
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
     done(null, user);
  });

}