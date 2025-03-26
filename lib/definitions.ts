export type SignUpData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpResponse = {
  message: string;
  error: boolean;
  status: number | string;
  user?: { id: string; email: string; role: string };
};

export type Stage = {
  stageNumber: number;
  title: string;
  description: string;
  imageUrl: string | null;
  stageEndDays: number;
};

export type VeggieType = {
  id?: number;
  name: string;
  description: string;
  type: string;
  image: string | null;
  stages: Stage[];
  created_at?: string;
  updated_at?: string;
  veggies?: string[];
};

export type CategoryType = {
  id: number;
  title: string;
  value: string;
};

// Define possible statuses for a plant
export type PlantStatus = "ongoing" | "done" | "canceled";

// Type definition for a plant in the garden
export type PlantType = {
  id: number;
  user_id: string;
  veggie_id: number;
  created_at: string;
  status: PlantStatus;
  veggie: VeggieType;
};

// Type definition for the API result
export type GetAllByUserIdResult = {
  success: boolean;
  data?: PlantType[];
  message?: string;
};
