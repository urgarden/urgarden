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

export interface Veggie {
  id: string;
  name: string;
  image?: any;
}
