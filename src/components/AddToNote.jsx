import React, { useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useVoiceProccessing } from "../hooks/useVoiceProccessing";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, functions } from "../firebase/firebaseConfig";
import { useNoteViewer } from "../contexts/NoteViewerProvider";
import { httpsCallable } from "firebase/functions";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function AddToNote({ note }) {
  const [isPolishing, setIsPolishing] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  const { setCurrentNote } = useNoteViewer();
  const appendToNote = async (transcribedText) => {
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

      const newPolished = response.data.content;
      setIsPolishing(false);

      setIsAppending(true);
      const noteRef = doc(db, "notes", note.id);

      await updateDoc(noteRef, {
        original: `${note.original} \n\n ${transcribedText}`,
        polished: `${note.polished} \n\n ${newPolished}`,
        content: `${note.content} \n\n ${newPolished}`,
        updatedAt: serverTimestamp(),
      });

      setCurrentNote({
        ...note,
        original: `${note.original} \n\n ${transcribedText}`,
        polished: `${note.polished} \n\n ${newPolished}`,
        content: `${note.content} \n\n ${newPolished}`,
        updatedAt: serverTimestamp(),
      });

      setIsAppending(false);
    } catch (error) {
      console.log("Error adding on to note:", error);
    }
  };

  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    formattedTimer,
  } = useVoiceProccessing({ onTranscriptionComplete: appendToNote });
  return (
    <div className="mt-2 mb-4">
      {isRecording ? (
        <div>
          <p className="mx-auto text-gray-500 rounded-lg px-9 py-0.5 bg-gray-100 w-fit text-xl">
            {formattedTimer()}
          </p>
          <button
            onClick={stopRecording}
            className="btn-primary btn-icon text-xs mx-auto mt-1 animate-pulse"
          >
            <FaStop /> stop recording
          </button>
        </div>
      ) : isTranscribing || isPolishing || isAppending ? (
        <button
          disabled={true}
          onClick={startRecording}
          className="btn-primary btn-icon text-xs mx-auto mt-1"
        >
          <AiOutlineLoading3Quarters className="animate-spin" />{" "}
          {(isTranscribing && "transcribing") ||
            (isPolishing && "polishing") ||
            (isAppending && "appending")}
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="btn-primary btn-icon text-xs mx-auto mt-1"
        >
          <FaMicrophone /> add to note
        </button>
      )}
    </div>
  );
}

export default AddToNote;
