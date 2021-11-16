import { useState, useRef } from 'react';
import Video from '../lib/Video.jsx';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { ICE_config } from '../ICE_config.js';

export default function Receiver({ db }) {
    const [offer, setOffer] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [stream, setStream] = useState(null);
    let video = useRef(null);

    async function newConnection() {
        let decodedOffer = JSON.parse(offer);
        if (!decodedOffer) return;

        const remoteConnection = new RTCPeerConnection(ICE_config);

        remoteConnection.onicecandidate = (e) => {
            setAnswer(remoteConnection.localDescription);
        };

        remoteConnection.ontrack = (event) => {
            // video.srcObject = event.streams[0];
            console.log('OnTrack', event);
            setStream(event);
        };

        remoteConnection.setRemoteDescription(decodedOffer).then((a) => {
            console.log('done!');
        });

        //create answer
        await remoteConnection
            .createAnswer()
            .then((a) => remoteConnection.setLocalDescription(a))
            .then((a) => setAnswer(remoteConnection.localDescription));
        //send the anser to the client
    }

    async function useOfferfromDB() {
        const docSnap = await getDoc(doc(db, 'offers', 'alpha'));

        if (docSnap.exists()) {
            let offer = docSnap.data().offer;
            setOffer(offer);
            newConnection();
            await deleteDoc(doc(db, 'offers', 'alpha'));
        } else {
            alert("Can't get Offer");
        }
    }

    async function saveAnswertoDB(answer) {
        await setDoc(doc(db, 'answers', 'alpha'), {
            answer,
        });
        alert('Answer saved!');
    }

    if (answer) {
        return (
            <div className="Receiver">
                <h1>Answer</h1>
                <p>{JSON.stringify(answer)}</p>
                <button onClick={() => saveAnswertoDB(JSON.stringify(answer))}>Save Answer to DB</button>
                <button onClick={() => setAnswer(null)}>Show screen</button>
            </div>
        );
    }

    if (stream?.streams) {
        return <Video stream={stream.streams[0]} />;
    }

    return (
        <div className="Receiver">
            <h1>Offer</h1>
            <input
                type="text"
                onChange={(e) => {
                    setOffer(e.target.value);
                }}
            />
            <button onClick={useOfferfromDB}>Connect using DB offer</button>
            <button onClick={newConnection}>Connect</button>
        </div>
    );
}
