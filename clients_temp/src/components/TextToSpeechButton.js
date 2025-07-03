import React, { useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const TextToSpeechButton = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const newUtterance = new SpeechSynthesisUtterance(text);

      newUtterance.onend = () => {
        setIsSpeaking(false);
      };

      synth.speak(newUtterance);
      setUtterance(newUtterance);
      setIsSpeaking(true);
    } else {
      alert('Text-to-speech not supported in this browser.');
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis && utterance) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <button
      onClick={isSpeaking ? stopSpeaking : speakText}
      className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      title={isSpeaking ? 'Stop Text-to-Speech' : 'Start Text-to-Speech'}
    >
      {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
  );
};

export default TextToSpeechButton;