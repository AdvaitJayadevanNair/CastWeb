import { useState, useRef, Suspense, lazy } from 'react';

export default function Home({ setIsSender }) {
    return (
        <div>
            <button onClick={() => setIsSender(true)}>Cast</button>
            <button onClick={() => setIsSender(false)}>Receive</button>
        </div>
    );
}
