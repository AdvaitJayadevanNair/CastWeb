import { useState, useRef, useEffect } from 'react';

export default function Video({ stream }) {
    let video = useRef(null);

    useEffect(() => {
        video.current.srcObject = stream;
    }, [stream]);

    return (
        <div className="Receiver">
            <video ref={video} autoPlay style={{
                height: "100vh",
                width: "100vw"
            }}/>
        </div>
    );
}
