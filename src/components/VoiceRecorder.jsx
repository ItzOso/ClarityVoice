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
import { useVoiceProccessing } from "../hooks/useVoiceProccessing";
import toast from "react-hot-toast";

function VoiceRecorder() {
  const [isPolishing, setIsPolishing] = useState(false);

  const { currentUser } = useAuth();
  const { setCurrentNote } = useNoteViewer();

  const createNote = async (transcribedText) => {
    setIsPolishing(true);
    try {
      const polishTranscription = httpsCallable(
        functions,
        "polishTranscription"
      );

      // returns json with title, content
      const response = await polishTranscription({
        transcription: transcribedText,
      });

      const noteData = response.data;

      const notesRef = collection(db, "notes");
      const data = {
        uid: currentUser.uid,
        title: noteData.title,
        content: noteData.content,
        polished: noteData.content,
        original: transcribedText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const noteRef = await addDoc(notesRef, data);
      setIsPolishing(false);
      setCurrentNote({ ...data, id: noteRef.id });
    } catch (error) {
      console.log("Error creating note", error);
      toast.error("An error occurred creating your note. Please try again.");
      setIsPolishing(false);
    }
  };

  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    formattedTimer,
  } = useVoiceProccessing({ onTranscriptionComplete: createNote });

  return (
    <div className="max-w-md border border-gray-200 rounded-lg p-6 text-center space-y-2 mx-auto">
      <p className="text-2xl font-semibold">Start Recording</p>
      <p className="text-gray-500">
        Speak clearly for the best transcription results
      </p>
      {isRecording && (
        <p className="font-semibold text-2xl">{formattedTimer()}</p>
      )}
      {!isTranscribing &&
        !isPolishing &&
        (!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="text-4xl p-8 text-white bg-primary hover:opacity-90 rounded-full w-fit mx-auto cursor-pointer"
          >
            <FaMicrophone />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-8 text-4xl text-white bg-primary hover:opacity-90 rounded-full w-fit animate-pulse mx-auto cursor-pointer"
          >
            <FaStop />
          </button>
        ))}

      {(isTranscribing || isPolishing) && (
        <div>
          <div
            className="animate-spin my-4 inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="font-semibold">
            {isTranscribing
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
