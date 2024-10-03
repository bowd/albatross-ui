import { AuthContext } from '@/providers/FirebaseAuthProvider';
import { useContext } from 'react';
import { EnhancedVuMeterInterface } from './enhanced-vu-meter-interface';
import { LoginFormComponent } from "./login-form";

export const Main = () => {
  const { signIn, isLoading, user } = useContext(AuthContext);
  console.log(user);
  if (user) {
    return (
      <EnhancedVuMeterInterface />
    );
  } else {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-screen">
        <LoginFormComponent />
      </div>
    )
  }
}
