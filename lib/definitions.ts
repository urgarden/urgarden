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

export interface Stage {
  stageNumber: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface VeggieType {
  id?: number;
  name: string;
  description: string;
  type: string;
  image: string | null;
  stages: Stage[];
  created_at?: string;
  updated_at?: string;
}
