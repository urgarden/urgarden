export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignUpResponse = {
  message: string;
  error: boolean;
  status: number | string;
};
