import { useState, useRef, Suspense, lazy } from 'react';
import * as Chakra from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import Loader from './lib/Loader.jsx';

export default function App() {
    const [isSender, setIsSender] = useState(null);
    const { toggleColorMode } = Chakra.useColorMode();
    const boxBackground = Chakra.useColorModeValue('gray.100', 'gray.700');

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
