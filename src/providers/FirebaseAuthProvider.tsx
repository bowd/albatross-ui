import { User, onAuthStateChanged } from 'firebase/auth'; //type User import
import { createContext, useEffect, useState } from 'react';
import { auth } from "@/lib/firebase";
import { firebaseSignUp, firebaseSignIn, LoginFormValues, UserFormValues, firebaseSignOut } from '@/lib/auth';

export interface IAuth {
  user: User | null;  //type User comes from firebase
  loading: boolean;
  signIn: (creds: LoginFormValues) => void;
  signUp: (creds: UserFormValues) => void;
  signOut: () => void;
}

export const AuthContext = createContext<IAuth>({
  user: auth.currentUser,
  loading: false,
  signIn: () => { },
  signUp: () => { },
  signOut: () => { },
});

export const FirebaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  //Sign up
  const signUp = (creds: UserFormValues) => {
    setIsLoading(true);
    firebaseSignUp(creds)
      .then(async signUpResult => {
        const { user } = signUpResult; //object destructuring
        if (user) {
          setCurrentUser(user);
        } else {
          console.log('User is empty');
          //do something if user is empty like an alert 
        }
        setIsLoading(false);
      })
      .catch(error => {
        //check for error
        if (error.code === 'auth/email-already-in-use') {
          console.log(error)
          //show an alert or console
        } else if (error.code === 'auth/too-many-requests') {
          console.log(error)
        }
        // you can check for more error like email not valid or something
        setIsLoading(false);
      });
  }

  //Sign in
  const signIn = async (creds: LoginFormValues, onSuccess: () => void) => {
    //setIsLoading(true);
    firebaseSignIn(creds)
      .then(signInResult => {
        console.log(signInResult);
        const { user } = signInResult;
        if (user) {
          setCurrentUser(user);
        }
        else {
          //do something 
        }
        setIsLoading(false);
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          //show error
        } else if (error.code === 'auth/too-many-requests') {
          //show error
        }
        setIsLoading(false);
      });
  }

  //Sign out
  const signOut = async () => {
    // setIsLoading(true);
    try {
      await firebaseSignOut();
      setCurrentUser(null);
    } catch (error) {
      setIsLoading(false);
      //show error alert
    }
  }
  //create Auth Values
  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
  }

  useEffect(() => {
    //onAuthStateChanged check if the user is still logged in or not
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  //If loading for the first time when visiting the page
  // if (isAuthLoading) return 
  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  )
}
