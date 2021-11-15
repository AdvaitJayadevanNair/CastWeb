import { useState, Suspense, lazy } from 'react';
import QRCode from "qrcode.react";

export default function Sender() {
    const [screens, setScreens] = useState([]);
    const [offer, setOffer] = useState(null);
    const [displayMediaStream, setDisplayMediaStream] = useState(null);
    const [sending, setSending] = useState([]);

    async function addScreen() {
        if (!displayMediaStream) {
            let temp = await navigator.mediaDevices.getDisplayMedia();
            setDisplayMediaStream(temp);
            return;
        }
        const localConnection = new RTCPeerConnection();
        let temp = [...sending];
        displayMediaStream.getTracks().forEach((track) => {
            temp.push(localConnection.addTrack(track, displayMediaStream));
        });
        setSending(temp);

        localConnection.onicecandidate = (e) => {
            const newScreens = [
                ...screens,
                {
                    connection: localConnection,
                    status: 'need answer',
                    offer: localConnection.localDescription,
                    hasBeenAnswered: false,
                    answer: '',
                },
            ];

            setScreens(newScreens);
        };

        localConnection.createOffer().then((o) => {
            localConnection.setLocalDescription(o);
        });
    }

    async function changeCast() {
        let temp = await navigator.mediaDevices.getDisplayMedia().catch((error) => {
            console.error(error);
        });
        if (temp) {
            displayMediaStream.getTracks().forEach((track) => track.stop());
            setDisplayMediaStream(temp);
            let temp2 = [...sending];
            temp2.filter((sender) => sender.track.kind === 'video').forEach((track) => track.replaceTrack(temp.getTracks()[0]));
        }
    }

    function answer(index) {
        let decodedAnswer = JSON.parse(screens[index].answer);
        if (!decodedAnswer) return;
        screens[index].connection.setRemoteDescription(decodedAnswer).then((a) => {
            let newScreens = [...screens];
            newScreens[index].hasBeenAnswered = true;
            setScreens(newScreens);
        });
    }

    return (
        <div>
            <h1>Cast</h1>
            <button onClick={addScreen}>Add Screen</button>
            <button onClick={changeCast}>Change Cast</button>
            <h3>Screens</h3>
            {screens.map((screen, index) => {
                return (
                    <div key={index}>
                        <b>{index}.</b>
                        <p>Status: {screen.connection.connectionState}</p>
                        <p>Has Been Answered: {screen.hasBeenAnswered ? 'Yes' : 'No'}</p>
                        {!screen.hasBeenAnswered && (
                            <>
                                <p>Offer: {JSON.stringify(screen.offer)}</p>
                                <QRCode value={JSON.stringify(screen.offer)} />
                                <input
                                    value={screen.answer}
                                    onChange={(e) => {
                                        let newScreens = [...screens];
                                        newScreens[index].answer = e.target.value;
                                        setScreens(newScreens);
                                    }}
                                    placeholder="Enter Answer"
                                ></input>
                                <button onClick={() => answer(index)}>Submit</button>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
