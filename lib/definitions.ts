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

export interface VeggieType {
  id: string;
  name: string;
  type?: string;
  description?: string;
  image?: any;
}

export interface Stage {
  stageNumber: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface VeggieForm {
  name: string;
  description: string;
  type: string;
  image: string | null;
  stages: Stage[];
}
