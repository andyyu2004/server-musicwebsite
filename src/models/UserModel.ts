export default interface UserModel {
  userid: number;
  email: string;
  password: string;
  salt: string;
  name?: string;
}