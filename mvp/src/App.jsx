import { useState, useRef, Suspense, lazy } from 'react';
import Loader from './lib/Loader.jsx';

export default function App() {
  const [isSender, setIsSender] = useState(null);

  const Home = lazy(() => import('./screens/Home.jsx'));
  const Sender = lazy(() => import('./screens/Sender.jsx'));
  const Receiver = lazy(() => import('./screens/Receiver.jsx'));

  if (isSender) {
      return (
          <Suspense fallback={<Loader />}>
              <Sender />
          </Suspense>
      );
  }

  if (isSender === false) {
      return (
          <Suspense fallback={<Loader />}>
              <Receiver />
          </Suspense>
      );
  }

  return (
      <Suspense fallback={<Loader />}>
          <Home setIsSender={setIsSender} />
      </Suspense>
  );
}
