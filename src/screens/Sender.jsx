import { useState, useRef } from 'react';
import * as Chakra from '@chakra-ui/react';
import { AddIcon, CopyIcon } from '@chakra-ui/icons';
//<div className="Sender">
//     <button onClick={newConnection}>New Screen</button>
// </div>
export default function Sender() {
    const [count, setCount] = useState(0);
    const [receivers, setReceivers] = useState([]);
    const [offer, setOffer] = useState(null);
    const [answer, setAnswer] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [currentAnswerIndex, setCurrentAnswerIndex] = useState(-1);

    const { isOpen: isOpenOffer, onOpen: onOpenOffer, onClose: onCloseOffer } = Chakra.useDisclosure();
    const { isOpen: isOpenAnswer, onOpen: onOpenAnswer, onClose: onCloseAnswer } = Chakra.useDisclosure();
    const { toggleColorMode } = Chakra.useColorMode();
    const boxBackground = Chakra.useColorModeValue('gray.100', 'gray.700');

//     async function newConnection() {
//         const displayMediaStream = await navigator.mediaDevices.getDisplayMedia();
// 
//         const localConnection = new RTCPeerConnection();
// 
//         displayMediaStream.getTracks().forEach((track) => {
//             localConnection.addTrack(track, displayMediaStream);
//         });
// 
//         localConnection.onconnectionstatechange = (ev) => {
//             switch (pc.connectionState) {
//                 case 'new':
//                 case 'checking':
//                     setOnlineStatus('Connecting...');
//                     break;
//                 case 'connected':
//                     setOnlineStatus('Online');
//                     break;
//                 case 'disconnected':
//                     setOnlineStatus('Disconnecting...');
//                     break;
//                 case 'closed':
//                     setOnlineStatus('Offline');
//                     break;
//                 case 'failed':
//                     setOnlineStatus('Error');
//                     break;
//                 default:
//                     setOnlineStatus('Unknown');
//                     break;
//             }
//         };
// 
//         localConnection.onicecandidate = (e) => {
//             setOffer(localConnection.localDescription);
//         };
// 
//         localConnection.createOffer().then((o) => {
//             localConnection.setLocalDescription(o);
//         });
//         setReceivers([localConnection, ...receivers]);
//     }
// 
//     function finishConnection() {
//         let decodedAnswer = JSON.parse(answer);
//         if (!decodedAnswer) return;
//         receivers[receivers.length - 1].setRemoteDescription(decodedAnswer).then((a) => {
//             console.log('done!');
//         });
//     }

    // if (offer) {
    //     return (
    //         <div className="Sender">
    //             <h1>Offer</h1>
    //             <p>{JSON.stringify(offer)}</p>
    //             <h1>Answer</h1>
    //             <input
    //                 type="text"
    //                 onChange={(e) => {
    //                     setAnswer(e.target.value);
    //                 }}
    //             />
    //             <button onClick={finishConnection}>Connect</button>
    //         </div>
    //     );
    // }

    async function addScreen() {
        setIsRunning(true);
        const displayMediaStream = await navigator.mediaDevices.getDisplayMedia().catch((error) => {
            console.error(error);
            setIsRunning(false);
        });
        if (!displayMediaStream) return;

        const newScreen = new RTCPeerConnection();

        displayMediaStream.getTracks().forEach((track) => {
            newScreen.addTrack(track, displayMediaStream);
        });

        newScreen.onconnectionstatechange = (ev) => {
            let index = receivers.length;
            switch (pc.connectionState) {
                case 'new':
                case 'checking':
                    setReceivers((receivers) => (receivers[index].connected = 'Connecting...'));
                    break;
                case 'connected':
                    setReceivers((receivers) => (receivers[index].connected = 'Online'));
                    break;
                case 'disconnected':
                    setReceivers((receivers) => (receivers[index].connected = 'Disconnecting...'));
                    break;
                case 'closed':
                    setReceivers((receivers) => (receivers[index].connected = 'Offline'));
                    break;
                case 'failed':
                    setReceivers((receivers) => (receivers[index].connected = 'Error'));
                    break;
                default:
                    setReceivers((receivers) => (receivers[index].connected = 'Unknown'));
                    break;
            }
        };

        newScreen.createOffer().then((o) => {
            newScreen.setLocalDescription(o);
            // setOffer(localConnection.localDescription);
            setOffer(o);
            onOpenOffer();
            setReceivers([
                ...receivers,
                {
                    connection: newScreen,
                    hasBeenAnswered: false,
                    connected: 'No',
                    offer: o,
                },
            ]);
        });
    }

    return (
        <>
            <Chakra.Modal isOpen={isOpenOffer} onClose={onCloseOffer}>
                <Chakra.ModalOverlay />
                <Chakra.ModalContent>
                    <Chakra.ModalHeader>Copy Offer</Chakra.ModalHeader>
                    <Chakra.ModalBody>
                        <Chakra.Text>{JSON.stringify(offer)}</Chakra.Text>
                    </Chakra.ModalBody>

                    <Chakra.ModalFooter>
                        <Chakra.Button
                            variant="ghost"
                            leftIcon={<CopyIcon />}
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(offer));
                            }}
                        >
                            Copy
                        </Chakra.Button>
                        <Chakra.Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                onCloseOffer();
                                setIsRunning(false);
                            }}
                        >
                            Close
                        </Chakra.Button>
                    </Chakra.ModalFooter>
                </Chakra.ModalContent>
            </Chakra.Modal>

            <Chakra.Modal isOpen={isOpenAnswer} onClose={onCloseAnswer}>
                <Chakra.ModalOverlay />
                <Chakra.ModalContent>
                    <Chakra.ModalHeader>Enter Answer</Chakra.ModalHeader>
                    <Chakra.ModalBody>
                        <Chakra.Text>
                            <Chakra.Input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Enter Answer" size="sm" />
                        </Chakra.Text>
                    </Chakra.ModalBody>

                    <Chakra.ModalFooter>
                        <Chakra.Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                let decodedAnswer = null;
                                try {
                                    decodedAnswer = JSON.parse(answer);
                                } catch (err) {
                                    return;
                                }
                                if (!decodedAnswer) return;
                                receivers[currentAnswerIndex].connection.setRemoteDescription(decodedAnswer).then((a) => {
                                    console.log('done!', currentAnswerIndex);
                                    setAnswer("");
                                    onCloseAnswer();
                                    setIsRunning(false);
                                });
                            }}
                        >
                            Answer
                        </Chakra.Button>
                    </Chakra.ModalFooter>
                </Chakra.ModalContent>
            </Chakra.Modal>

            <Chakra.Flex height="100vh" alignItems="center" justifyContent="center">
                <Chakra.Flex direction="column">
                    <Chakra.Box background={boxBackground} p={12} rounded={6} mb={4}>
                        <Chakra.Heading align="center" mb={4}>
                            Cast Mode
                        </Chakra.Heading>
                        <Chakra.Center mb={4}>
                            <Chakra.Button leftIcon={<AddIcon />} colorScheme="teal" variant="solid" mr={4} onClick={addScreen} isLoading={isRunning}>
                                Cast to new screen
                            </Chakra.Button>
                        </Chakra.Center>
                        <Chakra.Text fontSize="2xl" align="center">
                            Screens
                        </Chakra.Text>

                        <Chakra.OrderedList>
                            {receivers.map((receiver, index) => {
                                return (
                                    <Chakra.ListItem key={index}>
                                        Connected: {receiver.connected}
                                        <Chakra.Button
                                            isLoading={isRunning}
                                            variant="ghost"
                                            leftIcon={<CopyIcon />}
                                            onClick={() => {
                                                navigator.clipboard.writeText(JSON.stringify(receiver.offer));
                                            }}
                                        >
                                            Copy Offer
                                        </Chakra.Button>
                                        <Chakra.Button
                                            isLoading={isRunning}
                                            onClick={() => {
                                                setIsRunning(true);
                                                setCurrentAnswerIndex(index);
                                                onOpenAnswer();
                                            }}
                                        >
                                            Answer
                                        </Chakra.Button>
                                    </Chakra.ListItem>
                                );
                            })}
                        </Chakra.OrderedList>
                    </Chakra.Box>

                    <Chakra.Text align="center">© 2021 Advait Jayadevan Nair. All rights reserved.</Chakra.Text>
                </Chakra.Flex>
            </Chakra.Flex>
        </>
    );
}
