export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IEditUser {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
