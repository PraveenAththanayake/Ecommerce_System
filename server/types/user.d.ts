import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
