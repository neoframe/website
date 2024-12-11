import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

const App = (): ReactNode => {
  return 'Hello, World!';
};

// App has to come from another file because HMR & fast refresh always rebuild
// a new root on file save, creating multiple game canvas.
createRoot(document.getElementById('app')!).render(<App />);
