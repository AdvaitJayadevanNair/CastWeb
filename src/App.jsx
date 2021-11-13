import { useState, useRef } from 'react';

function App() {
    const [count, setCount] = useState(0);
    const videoElem = useRef(null);

    const displayMediaOptions = {
        video: {
            cursor: "always"
        },
        audio: false
    };

    async function startCapture() {
        try {
            videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            const videoTrack = videoElem.srcObject.getVideoTracks()[0];
            console.info("Track settings:");
            console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
            console.info("Track constraints:");
            console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
        } catch (err) {
            console.error("Error: " + err);
        }
    }

    function stopCapture(evt) {
        let tracks = videoElem.srcObject.getTracks();

        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
    }

    return (
        <div className="App">
            <button onClick={startCapture}>Start</button>
            <button onClick={stopCapture}>Stop</button>            
            <video ref={videoElem} />
        </div>
    )
}

export default App
