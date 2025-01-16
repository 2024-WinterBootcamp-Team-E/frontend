export const base64ToBlob = (base64, mimeType) => {
	const byteCharacters = atob(base64);
	const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: mimeType });
};

// 이하 사용 예시

// const AudioPlayer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);

//   const handlePlayPause = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const loadAudio = () => {
//     if (audioRef.current && tts_audio) {
//       const audioBlob = base64ToBlob(tts_audio, 'audio/mp3');
//       const audioUrl = URL.createObjectURL(audioBlob);
//       audioRef.current.src = audioUrl;
//     }
//   };

//   const base64ToBlob = (base64, mimeType) => {
//     const byteCharacters = atob(base64);
//     const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: mimeType });
//   };

//   return (
//     <Container>
//       <h1>Test Page: Base64 Audio Player</h1>
//       <AudioControls>
//         <Button onClick={loadAudio}>Load Audio</Button>
//         <Button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</Button>
//       </AudioControls>
//       <audio ref={audioRef} style={{ marginTop: '2rem', width: '100%' }} controls />
//     </Container>
//   );
// };
