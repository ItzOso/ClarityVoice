import { useCallback, useEffect, useRef, useState } from "react";
import { functions } from "../firebase/firebaseConfig";
import { httpsCallable } from "firebase/functions";

export function useVoiceProccessing({ onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const [timer, setTimer] = useState(null);
  const timerInterval = useRef(null);

  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const stream = useRef(null);

  const startRecording = useCallback(async () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop(); // Stop existing recording (will trigger onstop for its cleanup)
    }
    // If stream exists from a previous attempt that didn't clean up fully (e.g., error before onstop)
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = null;
    }
    chunks.current = [];
    URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream.current, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(chunks.current, {
            type: "audio/webm;codecs=opus",
          });
          setAudioUrl(URL.createObjectURL(audioBlob));
          setIsRecording(false);

          const transcribeAudio = httpsCallable(functions, "transcribeAudio");

          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const audioBase64 = reader.result.split(",")[1]; // Extract base64 data
              setIsTranscribing(true);
              const response = await transcribeAudio({ audioBase64 });
              setIsTranscribing(false);
              if (onTranscriptionComplete) {
                onTranscriptionComplete(response.data.text);
              }
            } catch (error) {
              console.error("Error sending audio to backend:", error);
              setIsTranscribing(false);
            }
          };
          reader.readAsDataURL(audioBlob);

          if (stream.current) {
            stream.current.getTracks().forEach((track) => track.stop());
            stream.current = null;
          }
        };

        mediaRecorder.current.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          setIsRecording(false);
          if (stream.current) {
            stream.current.getTracks().forEach((track) => track.stop());
            stream.current = null;
          }
        };

        mediaRecorder.current.start();
        startTimer();
        setIsRecording(true);
      }
    } catch (error) {
      console.log("Error recording audio:", error);
      setIsRecording(false);
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop(); // This will trigger the 'onstop' event handler
    } else if (isRecording) {
      // fixes inconsistencies in UI
      setIsRecording(false);
    }
  }, []);

  const startTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    setTimer(120); // 2 minute
    timerInterval.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerInterval.current);
          stopRecording();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formattedTimer = () => {
    const minutesLeft = Math.floor(timer / 60);
    const secondsLeft = Math.floor(timer % 60)
      .toString()
      .padStart(2, "0");
    return `${minutesLeft}:${secondsLeft}`;
  };

  useEffect(() => {
    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
      }
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    timer,
    formattedTimer,
  };
}
