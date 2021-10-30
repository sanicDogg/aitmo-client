import "./Stream.css";
import {useEffect, useRef, useState} from "react";

/*
* Компонент Stream
* props:
* socket - объект socket
* peer - объект peer
* currUser - имя текущего пользователя
* users - массив пользователей
 */

export const Stream = (props) => {
    let [ cameraStream, setCameraStream ]  = useState("");
    let [ streamer, setStreamer ]  = useState("");
    let [ isSoundMuted, setSoundMuted ]  = useState(true);
    let {socket, users, peer, currUser} = props;

    const videoRef = useRef(null);

    let calls = [];

    // Когда cameraStream обновится, делаем звонки всем участникам
    useEffect(() => {
        if (!cameraStream) {
            return;
        }

        try {
            let video = videoRef.current;
            video.srcObject = cameraStream;
            video.play();
        } catch (e) {
            console.error(e);
        }

        for (const user of users) {
            if (currUser === user.name) continue;
            let {peerId} = user;
            calls.push(peer.call(peerId, cameraStream));
        }
    }, [cameraStream, peer, currUser, users]);

    useEffect(() => {
        peer.on('call', (call) => {
            call.answer();
            call.on('stream', function(remoteStream) {
                try {
                    let video = videoRef.current;
                    video.srcObject = remoteStream;
                } catch (e) {
                    console.error(e)}
            });
        });

        socket.on("streamAccept", (streamer) => {
            setStreamer(streamer);
        });

        socket.on("streamClose", () => {
            setStreamer("");
            let video = videoRef.current;
            video.srcObject = null;
        })

    }, [peer, socket]);

    return (
        <div className={"streaming"}>
            <h1 className={"streaming__text"}>Streaming</h1>
            <video ref={videoRef} autoPlay={"autoplay"} muted={"muted"}/>
            {getStreamInterface()}
        </div>
    )

    function getStreamInterface() {
        let streamInterface;
        if (!streamer) {
            streamInterface =
                <div className={"streaming__start"} onClick={startBtnClicked}> Start stream </div>;
        } else
        if (streamer.name === currUser) {
            streamInterface =
                <div className={"streaming__interface"}>
                    <h2>You are streaming right now</h2>
                    <span className={"streaming__stop"} onClick={closeBtnClicked}> Close stream </span>
                </div>
        } else {
            streamInterface =
                <div className={"streaming__interface"}>
                    <h2>{streamer.name} is streaming now</h2>
                    { isSoundMuted ?
                        <span className={"streaming__enable-sound"}
                              onClick={enableSoundClicked}> Enable Sound </span>
                        :
                        <span className={"streaming__enable-sound"}
                              onClick={enableSoundClicked}> Disable Sound </span>

                    }
                </div>
        }
        return streamInterface;
    }

    function enableSoundClicked() {
        let video = videoRef.current;
        video.muted = !video.muted;
        setSoundMuted(!isSoundMuted);
    }

    function closeBtnClicked() {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        for (const call of calls) {
            call.close();
        }
        socket.emit("streamStop");
    }

    function startBtnClicked() {
        if (!window.navigator.mediaDevices) {
            alert("Camera is not available");
            return;
        }
        if (streamer) {alert("Stream started by other user"); return}
        // Сигнал серверу о начале стрима
        socket.emit("streamRequest");
        window.navigator.mediaDevices.getUserMedia(
            {
                video: {width: 300},
                audio: true
            })
        .then(r => setCameraStream(r))
        .catch(err => {
            console.error("error:", err);
        });
    }
}