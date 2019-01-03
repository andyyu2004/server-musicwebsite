export default interface UserModel {
  email: string;
  password: string;
  salt: string;
  name?: string;
}