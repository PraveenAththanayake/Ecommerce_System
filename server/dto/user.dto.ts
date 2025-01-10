export interface CreateUserInput {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  salt: string;
  role: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface EditUserInput {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
}
