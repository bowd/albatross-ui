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
      <div className="tw-flex tw-items-center tw-justify-center tw-h-screen">
        <LoginFormComponent />
      </div>
    )
  }
}
