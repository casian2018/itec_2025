import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

interface TextToSpeechProps {
  initialText?: string;
  autoPlay?: boolean;
}

const TextToSpeech = ({ initialText = '', autoPlay = false }: TextToSpeechProps) => {
  const [text, setText] = useState<string>(initialText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Update the text when initialText prop changes
    if (initialText) {
      setText(initialText);
      
      // Auto play if both initialText and autoPlay are provided
      if (autoPlay) {
        convertToSpeech(initialText);
      }
    }
  }, [initialText, autoPlay]);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioUrl, audioElement]);

  // Add event listeners for audio element
  useEffect(() => {
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };
      
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioElement]);

  const convertToSpeech = async (textToConvert: string) => {
    if (!textToConvert.trim()) return;
    
    setIsLoading(true);

    try {
      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioElement) {
        audioElement.pause();
      }

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToConvert, 
          voiceId: '29vD33N1CtxCmqQRPOHJ' // Using a default voice ID
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        const audio = new Audio(url);
        setAudioElement(audio);
        
        // Play the audio
        audio.play();
        setIsPlaying(true);
      } else {
        const error = await response.json();
        console.error('Error generating speech:', error);
        alert('Failed to convert text to speech. Please try again.');
      }
    } catch (error) {
      console.error('Text-to-Speech error:', error);
      alert('An error occurred during text-to-speech conversion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await convertToSpeech(text);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const togglePlayPause = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `speech-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="mt-4 text-to-speech-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Enter text to convert to speech"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-green-200 focus:border-green-500"
          rows={4}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button 
            type="submit" 
            disabled={isLoading || !text.trim()} 
            className={`px-4 py-2 rounded-lg font-medium text-white flex-1 ${
              isLoading || !text.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Convert to Speech'}
          </button>
          
          {audioUrl && (
            <div className="audio-controls flex gap-2">
              <button 
                type="button"
                onClick={togglePlayPause}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button 
                type="button"
                onClick={downloadAudio}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TextToSpeech;
