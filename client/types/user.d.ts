export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  address: string;
  phone?: string;
  role?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setError: (error: string | null) => void;
}
