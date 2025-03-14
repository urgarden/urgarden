import { db } from "./FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const saveUserToFirestore = async (user: {
  id: string;
  username: string;
  email: string;
}) => {
  try {
    await setDoc(doc(db, "users", user.id), {
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to save user to Firestore");
  }
};
