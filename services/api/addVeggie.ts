import { db } from "../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { VeggieForm } from "@/lib/definitions";

export const addVeggieToFirebase = async (veggie: VeggieForm) => {
  try {
    await addDoc(collection(db, "veggies"), veggie);
  } catch (error) {
    console.error("Error adding vegetable: ", error);
    throw error;
  }
};
