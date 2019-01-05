import { hashPassword, createUserObj, checkUnique, addUserToDB, getPassword, getUserSalt } from '../repositories/users';

async function registerUser(req, res) {
  try {
    const { email, name, password, salt } = req.body;
    const isUnique = await checkUnique(email).catch(err => { console.log(err); throw err; });
    if (!isUnique) {
      console.log(`User ${email} already exists`);
      return res.status(200).send("User already exists");
    }
    const newUser = createUserObj(email, name, password, salt);
    await addUserToDB(newUser).catch(err => { console.log(err); throw err; });
    console.log('done')
  } catch (err) {
    console.log("Error in registerUser " + err);
    res.status(500).send(err);
  }
}

async function signInUser(req, res) {
  try {
    const { session, sessionID } = req;
    const { email, password } = req.body;
    console.log("Sign In Requested");
    const userExists = !(await checkUnique(email).catch(err => { console.log(err); throw err }));
    if (!userExists) {
      console.log(email, "does not exist");
      return res.status(200).send("User Does Not Exist");
    }
    const { password: hashedPassword } = await getPassword(email).catch(err => { console.log(err); throw err });
    if (password !== hashedPassword) {
      console.log("Incorrect Password");
      return res.status(403).send("Incorrect Password");
    }
    console.log("Correct Password");
  } catch (err) {
    console.log("Error in signInUser " + err);
    res.status(500).send(err);
  }
}

async function getSalt(req, res) {
  try {
    const { email } = req.params;
    const salt = await getUserSalt(email).catch(err => { console.log(err); throw err });
    if (!salt) {
      console.log("USER DOES NOT EXIST");
      return res.send(null);
    }
    res.status(200).send(salt);
  } catch (err) {
    console.log("Error in getSalt " + err);
    res.status(500).send(err);
  }
}

export { 
  registerUser,
  signInUser,
  getSalt,
};