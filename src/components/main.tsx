import { AuthContext } from '@/providers/FirebaseAuthProvider';
import { useContext } from 'react';
import { Interface } from './interface';
import { LoginFormComponent } from "./login-form";

export const Main = () => {
  const { signIn, isLoading, user } = useContext(AuthContext);
  console.log(user);
  if (user) {
    return (
      <Interface />
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <LoginFormComponent />
      </div>
    )
  }
}
