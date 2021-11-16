import { useState, useRef, Suspense, lazy } from 'react';
import Loader from './lib/Loader.jsx';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAQNC0hSYYQW8yJnUF3Alm2RkYd3ak0x-A',
  authDomain: 'multicastweb.firebaseapp.com',
  projectId: 'multicastweb',
  storageBucket: 'multicastweb.appspot.com',
  messagingSenderId: '442867944831',
  appId: '1:442867944831:web:0ec6ebd4578b7365b81e4a',
  measurementId: 'G-0E081R0ZYE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default function App() {
  const [isSender, setIsSender] = useState(null);

  const Home = lazy(() => import('./screens/Home.jsx'));
  const Sender = lazy(() => import('./screens/Sender.jsx'));
  const Receiver = lazy(() => import('./screens/Receiver.jsx'));

  if (isSender) {
    return (
      <Suspense fallback={<Loader />}>
        <Sender db={db} />
      </Suspense>
    );
  }

  if (isSender === false) {
    return (
      <Suspense fallback={<Loader />}>
        <Receiver db={db} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Home setIsSender={setIsSender} />
    </Suspense>
  );
}
