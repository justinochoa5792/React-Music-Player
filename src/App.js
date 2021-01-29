import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Wave from "@foobar404/wave";
import audio from "./static/audio";
import Prev from "./component/Prev";
import Next from "./component/Next.jsx";
import PlayAndPause from "./component/PlayAndPause.jsx";

function App() {
  const songRef = useRef(null);
  const [wave] = useState(new Wave());

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const currentSong = audio[currentSongIndex];

  useEffect(() => {
    window.document
      .getElementById("audio_element")
      .addEventListener("loadedmetadata", (e) => {
        songRef.current = e.target;
      });
    wave.fromElement("audio_element", "canvas_element", {
      type: "flower",
      colors: ["#000", "#fff"],
    });
  }, [wave]);

  const nextSong = (value) => {
    const nextSongIndex = currentSongIndex + value;
    const firstSongIndex = 0;
    const lastSongIndex = audio.length - 1;
    if (nextSongIndex >= audio.length) {
      setCurrentSongIndex(firstSongIndex);
    } else if (nextSongIndex < firstSongIndex) {
      setCurrentSongIndex(lastSongIndex);
    } else {
      setCurrentSongIndex(nextSongIndex);
    }
    setHasChanged(true);
    setIsPaused(true);
  };

  return (
    <div className="App">
      <h1>Music Player</h1>
      <div className="container">
        <div className="img-container">
          <LazyLoadImage
            src={currentSong.img}
            placeholderSrc={currentSong.placeholder}
            width="355px"
            className={`img ${isPaused ? " animation-spin" : ""}`}
          />
          <canvas width="350px" height="350px" id="canvas_element" />
        </div>
        <div className="song-info">
          <h1>{currentSong.songName}</h1>
          <p>{currentSong.singer}</p>
          <audio
            autoPlay={hasChanged}
            onEnded={() => nextSong(1)}
            src={currentSong.src}
            onTimeUpdate={() => setValue(songRef.current.currentTime)}
            id="audio_element"
          />
          <div>
            <input
              value={value}
              type="range"
              min={0}
              max={songRef.current?.duration}
              onChange={(e) => (songRef.current.currentTime = e.target.value)}
            />
          </div>
          <div className="controller">
            <Prev nextSong={nextSong} />
            <PlayAndPause
              songRef={songRef}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
            <Next nextSong={nextSong} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
