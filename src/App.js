import Recorder from './components/Recorder'
import './App.css';
import { useEffect, useState, useMemo, useCallback } from 'react';

function App() {
  const constraints = useMemo(() => {
    return {
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    }
  }, [])
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  // const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (stream) {
      return
    }

    let didCancel = false

    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!didCancel) {
          setStream(stream);
        }
      } catch (err) {
        if (!didCancel) {
          setError(err);
        }
      }
    }

    const cancel = () => {
      didCancel = true;

      if (!stream) return;

      if ((stream).getAudioTracks) {
        (stream).getAudioTracks().map(track => track.stop());
      }

      if ((stream).stop) {
        (stream).stop();
      }
    }

    getUserMedia();

    return cancel;
  }, [constraints, stream, error])

  const recoderRenderer = useCallback(() => {
    if (stream === null) {
      return (<button className="record-play">Loading…</button>)
    }
    return (
      // <div className="commands"><Recorder stream={stream} volume={volume}></Recorder><input type="range" min="0" max="100" value={volume} onChange={
      //   e => setVolume(e.target.value)
        <Recorder stream={stream} ></Recorder>
    )
  },[stream]);

  return (
    <>
      <header>
        <h1>Sound Recorder</h1>
      </header>
      <main>
        {recoderRenderer()}
      </main>
    </>
  );
}

export default App;
