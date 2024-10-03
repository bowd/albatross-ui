import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase';

setPersistence(auth, browserLocalPersistence);

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName: string;
}

//Sign in functionality
export const firebaseSignIn = async ({ email, password }: LoginFormValues) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result;
};

//Sign up functionality
export const firebaseSignUp = async ({ email, password }: UserFormValues) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
};

//Sign out functionality
export const firebaseSignOut = async () => {
  await signOut(auth);
};
