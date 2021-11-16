import { useState, Suspense, lazy } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { ICE_config } from '../ICE_config.js';

export default function Sender({ db }) {
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
        const localConnection = new RTCPeerConnection(ICE_config);
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
                    status: 'new',
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

    async function saveOffertoDB(offer) {
        await setDoc(doc(db, 'offers', 'alpha'), {
            offer,
        });
        alert('Offer saved!');
    }

    async function useAnswerfromDB(index) {
        const docSnap = await getDoc(doc(db, 'answers', 'alpha'));
         

        if (docSnap.exists()) {
            let newScreens = [...screens];
            newScreens[index].answer = docSnap.data().answer;
            setScreens(newScreens);
            answer(index);
            await deleteDoc(doc(db, 'answers', 'alpha'));
        } else {
            alert("Can't get Answer");
        }
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
                                <button onClick={() => saveOffertoDB(JSON.stringify(screen.offer))}>Save Offer to DB</button>
                                <button onClick={() => useAnswerfromDB(index)}>Use Answer from DB</button>
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
