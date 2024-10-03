import { createRoot } from 'react-dom/client';
import { Main } from './components/main';

import { FirebaseAuthProvider } from './providers/FirebaseAuthProvider';
import { SongsProvider } from './providers/SongsProvider';

const root = createRoot(document.getElementById('application--root'));

const App = () => {
  return (
    <FirebaseAuthProvider>
      <SongsProvider>
        <Main />
      </SongsProvider>
    </FirebaseAuthProvider>

  )
}

root.render(<App />);
