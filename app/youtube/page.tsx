// import React from 'react';
// import { XSound, X } from 'xsound';
// import YouTube from 'react-youtube';

// const VideoPlayer: React.FC = () => {
//   const playVideo = () => {
//     // URL dari video YouTube
//     const videoId = 'DOOrIxw5xOw';

//     // Create an instance of AudioContext
//     const context = XSound.get();

//     // EFFECT OVERDRIVE
//     const overdrive = new X.OverDrive(context);
//     overdrive.param({
//       drive: 1
//     });
//     overdrive.activate();

//     // EFFECT PITCH SHIFTER
//     const pitchShifter = new X.PitchShifter(context);
//     pitchShifter.param({
//       state: true,
//       pitch: 2
//     });
//     pitchShifter.activate();

//     // Start playing the video
//     XSound.play({
//       src: `youtube:${videoId}`,
//       effect: [overdrive, pitchShifter]
//     });
//   };

//   return (
//     <div>
//       <button onClick={playVideo}>Play Video with Effects</button>
//       <YouTube videoId="DOOrIxw5xOw" />
//     </div>
//   );
// };

// export default VideoPlayer;
