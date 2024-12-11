import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Home from './Home';
import Play from './Play';

const App = () => {
  const [cartridge, setCartridge] = useState<number>(-1);

  return cartridge >= 0 ? (
    <Play cartridge={cartridge} />
  ) : (
    <Home onPlay={setCartridge} />
  );
};

// App has to come from another file because HMR & fast refresh always rebuild
// a new root on file save, creating multiple game canvas.
createRoot(document.getElementById('app')!).render(<App />);
