import { hashPassword, createUserObj, checkUnique, addUserToDB, getPassword, getUserSalt } from '../repositories/users';
import * as crypto from 'crypto';

async function registerUser(req, res) {
  try {
    const { name, password, salt } = req.body;
    const email = req.body.email.toLowerCase();
    const isUnique = await checkUnique(email).catch(err => { throw err; });
    if (!isUnique) {
      console.log(`User ${email} already exists`);
      return res.status(200).send("User already exists");
    }
    const newUser = createUserObj(email, name, password, salt);
    await addUserToDB(newUser).catch(err => { throw err; });
    console.log('User Created', email);
  } catch (err) {
    console.log("Error in registerUser " + err);
    res.status(500).send(err);
  }
}

// async function signInUser(req, res) {
//   try {
//     const { session, sessionID } = req;
//     const { email, password } = req.body;
//     console.log("Sign In Requested");
//     const userExists = !(await checkUnique(email).catch(err => { console.log(err); throw err }));
//     if (!userExists) {
//       console.log(email, "does not exist");
//       return res.status(200).send("User Does Not Exist");
//     }
//     const { password: hashedPassword } = await getPassword(email).catch(err => { console.log(err); throw err });
//     if (password !== hashedPassword) {
//       console.log("Incorrect Password");
//       return res.status(403).send("Incorrect Password");
//     }
//     console.log("Correct Password");
//   } catch (err) {
//     console.log("Error in signInUser " + err);
//     res.status(500).send(err);
//   }
// }

async function getSalt(req, res) {
  try {
    let { email } = req.params;
    email = email.toLowerCase();
    const salt = await getUserSalt(email).catch(err => { throw err; });
    if (!salt) {
      console.log("USER DOES NOT EXIST");
      return res.status(400).send("User does not exist");
    }
    res.status(200).json(salt);
  } catch (err) {
    console.log("Error in getSalt " + err);
    return res.status(500).send(err);
  }
}

async function encrypt(req, res) {
  try {
    const { email, password } = req.body;
    console.log('encrypt');
    const resp = await getUserSalt(email).catch(err => { throw err; });
    const salt = resp.salt;
    if (!salt) {
      console.log("USER DOES NOT EXIST");
      return res.status(400).send("User does not exist");
    }
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');
    return res.status(200).send(hash);
  } catch (err) {
    console.log("Error in encrypt " + err);
    return res.status(500).send();
  }
}

export { 
  registerUser,
  getSalt,
  //signInUser,
  encrypt,
};