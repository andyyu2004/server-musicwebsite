import { UserModel } from '../models';
import query from '../services/mysql';
import * as crypto from 'crypto';

function createUserObj(email: string, name: string, password: string, salt: string): UserModel {
  return {
    email,
    password,
    name,
    salt,
  };
}

async function checkUnique(email: string) {
  const command = `SELECT 1 FROM Users WHERE email = ?`;
  try {
    const res = await query(command, email);
    return res.length === 0;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function addUserToDB(user: UserModel) {
  const command = "INSERT INTO Users SET ?";
  try {
    return await query(command, user);
  } catch (err) {
    console.log("Failed to insert User" + err);
    throw err;
  }
}

async function getPassword(email: string) {
  const command = `SELECT password from users WHERE email = ? LIMIT 1`;
  try {
    const [ password ] = await query(command, email);
    return password;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function hashPassword(password: string, salt: string): Promise<string> {
  return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

async function getUserSalt(email: string) {
  const command = `SELECT salt from users WHERE email = ? LIMIT 1`;
  try {
    const [ salt ] = await query(command, email);
    return salt;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { 
  createUserObj, 
  checkUnique,
  addUserToDB,
  getPassword,
  hashPassword,
  getUserSalt,
};