import React, { useState, useEffect } from "react";
import axios from "axios";

const YoutubePlayer = ({ videoId }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${videoId}&key=AIzaSyCEnJmvlAMzmLPThfmgh6XujQ1ByrLWedI`
      )
      .then((response) => {
        const videoData = response.data.items[0].snippet;
        const title = videoData.title;
        
        const videoPlayer = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        setPlayer(
          <div>
            <h2>{title}</h2>
            
            
            <iframe
              width="560"
              height="315"
              src={videoPlayer}
              
              allowFullScreen
            ></iframe>
          </div>
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [videoId]);

  return <div>{player}</div>;
};

export default YoutubePlayer;