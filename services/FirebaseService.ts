import { db, auth } from "./FirebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { SignUpData, SignUpResponse } from "@/lib/definitions";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const signup = async (data: SignUpData): Promise<SignUpResponse> => {
  let dateCreated = Timestamp.fromDate(new Date());

  try {
    // Signup using createUserWithEmailAndPassword function of Firebase
    await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Get the user object after signup
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not found after signup.");
    }

    // Use user.uid as the docId
    const userDocRef = doc(db, "users", user.uid);

    // Exclude the password and confirmPassword fields from the data
    const { password, confirmPassword, ...userData } = data;

    // Set the data in the document
    await setDoc(userDocRef, {
      ...userData,
      userId: user.uid,
      dateCreated,
    });

    return {
      message: "Account successfully created!",
      error: false,
      status: 201,
    };
  } catch (error: any) {
    return { error: true, message: error.message, status: error.code };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    throw new Error("Failed to log out user");
  }
};
