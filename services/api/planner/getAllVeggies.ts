import { db } from "@/services/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getAllVeggies = async () => {
  try {
    const veggiesCollection = collection(db, "veggies");
    const veggiesSnapshot = await getDocs(veggiesCollection);
    const veggiesList = veggiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return veggiesList;
  } catch (error) {
    console.error("Error getting veggies: ", error);
    throw error;
  }
};
