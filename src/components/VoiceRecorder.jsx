import { useContext, useEffect, useRef, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { db, functions } from "../firebase/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthProvider";
import {
  NoteViewerContext,
  useNoteViewer,
} from "../contexts/NoteViewerProvider";

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");
  const stream = useRef(null);

  const [timer, setTimer] = useState(null);
  const timerInterval = useRef(null);

  const { currentUser } = useAuth();
  const { setCurrentNote } = useNoteViewer();

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
          handleStopRecording();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const minutesLeft = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutesLeft}:${secondsLeft}`;
  };

  const handleRecordAudio = async () => {
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
          setRecording(false);

          const transcribeAudio = httpsCallable(functions, "transcribeAudio");

          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const audioBase64 = reader.result.split(",")[1]; // Extract base64 data
              setTranscribing(true);
              const response = await transcribeAudio({ audioBase64 });
              setTranscribing(false);
              createNote(response.data.text);
            } catch (error) {
              console.error("Error sending audio to backend:", error);
              setTranscribing(false);
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
          setRecording(false);
          if (stream.current) {
            stream.current.getTracks().forEach((track) => track.stop());
            stream.current = null;
          }
        };

        mediaRecorder.current.start();
        startTimer();
        setRecording(true);
      }
    } catch (error) {
      console.log("Error recording audio:", error);
      setRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop(); // This will trigger the 'onstop' event handler
    } else if (recording) {
      // fixes inconsistencies in UI
      setRecording(false);
    }
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

  const createNote = async (originalContent) => {
    setPolishing(true);
    try {
      const polishTranscription = httpsCallable(
        functions,
        "polishTranscription"
      );

      // returns json with title, content
      const response = await polishTranscription({
        transcription: originalContent,
      });

      const noteData = response.data;

      const notesRef = collection(db, "notes");
      const data = {
        uid: currentUser.uid,
        title: noteData.title,
        content: noteData.content,
        original: originalContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const noteRef = await addDoc(notesRef, data);
      setPolishing(false);
      setCurrentNote({ ...data, id: noteRef.id });
    } catch (error) {
      console.log("Error creating note", error);
      setPolishing(false);
    }
  };

  return (
    <div className="max-w-md border border-gray-200 rounded-lg p-6 text-center space-y-2 mx-auto">
      <p className="text-2xl font-semibold">Start Recording</p>
      <p className="text-gray-500">
        Speak clearly for the best transcription results
      </p>
      {recording && (
        <p className="font-semibold text-2xl">{formatTimer(timer)}</p>
      )}
      {!transcribing &&
        !polishing &&
        (!recording ? (
          <button
            onClick={handleRecordAudio}
            disabled={recording}
            className="text-4xl p-8 text-white bg-primary hover:opacity-90 rounded-full w-fit mx-auto cursor-pointer"
          >
            <FaMicrophone />
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="p-8 text-4xl text-white bg-primary hover:opacity-90 rounded-full w-fit animate-pulse mx-auto cursor-pointer"
          >
            <FaStop />
          </button>
        ))}

      {(transcribing || polishing) && (
        <div>
          <div
            className="animate-spin my-4 inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="font-semibold">
            {transcribing
              ? "Transcribing your recording..."
              : "Polishing your recording..."}
          </p>
        </div>
      )}

      {/* <audio controls src={audioUrl || null}></audio> */}
    </div>
  );
}

export default VoiceRecorder;
