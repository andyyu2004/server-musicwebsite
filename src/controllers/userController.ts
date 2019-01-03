import { hashPassword, createUserObj, checkUnique, addUserToDB, getPassword, getUserSalt } from '../repositories/users';

async function registerUser(req, res) {
  const { email, name, password, salt } = req.body;
  const isUnique = await checkUnique(email);
  if (!isUnique) {
    console.log(`User ${email} already exists`);
    return res.status(200).send("User already exists");
  }
  const newUser = createUserObj(email, name, password, salt);
  await addUserToDB(newUser);
  console.log('done')
}

async function signInUser(req, res) {
  const { session, sessionID } = req;
  const { email, password } = req.body;
  console.log("Sign In Requested");
  const userExists = !(await checkUnique(email));
  if (!userExists) {
    console.log(email, "does not exist");
    return res.status(200).send("User Does Not Exist");
  }
  const { password: hashedPassword } = await getPassword(email);
  if (password !== hashedPassword) {
    console.log("Incorrect Password");
    return res.status(403).send("Incorrect Password");
  }
  console.log("Correct Password");
}

async function getSalt(req, res) {
  const { email } = req.params;
  const salt = await getUserSalt(email);
  if (!salt) {
    console.log("USER DOES NOT EXIST");
    return res.send(null);
  }
  res.send(salt);
}

export { 
  registerUser,
  signInUser,
  getSalt,
};